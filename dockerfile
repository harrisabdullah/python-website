FROM emscripten/emsdk:5.0.4

# Install Node.js and http-server
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g http-server && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

# Build the MicroPython WebAssembly port using the stable 5.0.4 environment
RUN /bin/bash -c "source /emsdk/emsdk_env.sh && cd micropython && cd ports/webassembly && make"

EXPOSE 8080

CMD ["http-server", "-p", "8080"]