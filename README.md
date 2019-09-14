<h1> UTech Assignment Project </h1>
demo: https://abolnoor.github.io/utech-assignment

# setup:
0- install nodejs and npm _ https://nodejs.org/

1- install Angular cli _ https://cli.angular.io/
npm install -g @angular/cli

3- inside project directory run:
npm install

3- run:
ng serve --open
old: ng serve --proxy-config .\proxy.conf.json --open (proxy used for allow change origin "CORS" and rewrite /api url)

# authentication:
- current user info is saved in the browser's coockies: localStorage
- Token is sent with Authorization header in every request using: HttpInterceptor
- (auth/jwt.service.ts)

# authorization:
every rout has "allowed roles" identified array, and the user allowed to access is checked by every route changing
- (admin/admin-routing.module.ts)
- (auth/auth.service.ts)

# front end framework
- angular 8
- angular material is used
- css: scss
