import { Router } from '@enigmagtm/core';

export class RouterLog {
  routes: any[] = [];

  register(router: Router) {
    router.stack.forEach((stack: any) => {
      this.routes.push({
        path: stack.route?.path || 'middleware function',
        method: stack.route?.stack[0]?.method || 'all'
      });
    });
  }

  display() {
    console.log('----- List REST endpoints -----');
    this.routes.forEach((route: any) => {
      console.log(route);
    });
    console.log('----- List REST endpoints -----');
  }
}

export const routerLog = new RouterLog();
