import os
import re
import sys
import http.server
import socketserver
import urllib.parse

class RangeRequestHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        """Common code for GET and HEAD commands.
        This sends the response code and MIME headers.
        """
        path = self.translate_path(self.path)
        f = None
        if os.path.isdir(path):
            parts = urllib.parse.urlsplit(self.path)
            if not parts.path.endswith('/'):
                # redirect browser - append slash
                self.send_response(http.HTTPStatus.MOVED_PERMANENTLY)
                new_parts = parts._replace(path=parts.path + '/')
                new_url = urllib.parse.urlunsplit(new_parts)
                self.send_header("Location", new_url)
                self.end_headers()
                return None
            for index in "index.html", "index.htm":
                index = os.path.join(path, index)
                if os.path.exists(index):
                    path = index
                    break
            else:
                return super().list_directory(path)
        
        ctype = self.guess_type(path)
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(http.HTTPStatus.NOT_FOUND, "File not found")
            return None

        # Check for range header
        range_header = self.headers.get('Range')
        if range_header:
            match = re.match(r'bytes=(\d+)-(\d*)', range_header)
            if match:
                start = int(match.group(1))
                end = match.group(2)
                end = int(end) if end else None
                
                try:
                    fs = os.fstat(f.fileno())
                    file_len = fs[6]
                except (AttributeError, OSError):
                    f.seek(0, 2)
                    file_len = f.tell()
                    f.seek(0)
                
                if end is None or end >= file_len:
                    end = file_len - 1
                
                if start >= file_len:
                    self.send_error(http.HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
                    f.close()
                    return None
                
                self.send_response(http.HTTPStatus.PARTIAL_CONTENT)
                self.send_header('Content-Type', ctype)
                self.send_header('Content-Range', f'bytes {start}-{end}/{file_len}')
                self.send_header('Content-Length', str(end - start + 1))
                self.send_header('Accept-Ranges', 'bytes')
                self.end_headers()
                
                f.seek(start)
                return f
        
        # Default behavior
        try:
            fs = os.fstat(f.fileno())
            self.send_response(http.HTTPStatus.OK)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(fs[6]))
            self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
            self.send_header("Accept-Ranges", "bytes")
            self.end_headers()
            return f
        except Exception:
            f.close()
            raise

    # Override copyfile to only copy the specified range
    def copyfile(self, source, outputfile):
        range_header = self.headers.get('Range')
        if range_header:
            match = re.match(r'bytes=(\d+)-(\d*)', range_header)
            if match:
                start = int(match.group(1))
                end = match.group(2)
                
                try:
                    fs = os.fstat(source.fileno())
                    file_len = fs[6]
                except (AttributeError, OSError):
                    source.seek(0, 2)
                    file_len = source.tell()
                    source.seek(0)
                
                end = int(end) if end else file_len - 1
                if end >= file_len:
                    end = file_len - 1
                
                bytes_to_read = end - start + 1
                source.seek(start)
                
                # Copy only the range
                buffer_size = 64 * 1024
                while bytes_to_read > 0:
                    chunk = source.read(min(buffer_size, bytes_to_read))
                    if not chunk:
                        break
                    outputfile.write(chunk)
                    bytes_to_read -= len(chunk)
                return
        
        # Default copyfile
        super().copyfile(source, outputfile)

if __name__ == '__main__':
    port = 8000
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
        
    Handler = RangeRequestHandler
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), Handler) as httpd:
        print(f"Serving HTTP on port {port} with Range support...")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
