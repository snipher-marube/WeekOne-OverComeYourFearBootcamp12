FROM nginx
COPY ./server-engine/nginx.conf /etc/nginx/nginx.conf
# COPY ./server-engine/nginx.conf /etc/nginx/sites-available/default
COPY . /taxman
