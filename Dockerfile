# Use a Debian-based image as it provides good support for both Python and PHP
FROM php:latest

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-numpy \
    python3-pandas \
    python3-plotly \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy PHP scripts and binaries into the appropriate directories in the container
COPY app/ /var/www/html/

# Adjust permissions if needed
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html


# Expose port 80 for web traffic
EXPOSE 80

# Start Apache in the foreground
CMD ["apache2-foreground"]