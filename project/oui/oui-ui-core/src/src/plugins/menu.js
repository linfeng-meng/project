import {ubus} from './ubus'
import axios from 'axios'
import i18n from '@/i18n'

const menu = {}

function parseMenus(raw) {
  let menus = {};

  Object.keys(raw).forEach(m => {
    const paths = m.split('/');
    if (paths.length === 1)
      menus[paths[0]] = raw[m];
  });

  Object.keys(raw).forEach(m => {
    const [menu, submenu] = m.split('/');
    if (submenu && menus[menu]) {
      if (!menus[menu].children)
        menus[menu].children = {};
      menus[menu].children[submenu] = raw[m];
    }
  });

  menus = Object.keys(menus).map(k => {
    return {path: '/' + k, ...menus[k]};
  });

  menus.forEach(m => {
    if (!m.children)
      return;

    m.children = Object.keys(m.children).map(k => {
      return {path: `${m.path}/${k}`, ...m.children[k]};
    });

    m.children.sort((a, b) => a.index - b.index);
  });

  menus.sort((a, b) => a.index - b.index);

  return menus.filter(m => m.children);
}

function buildRoute(menu) {
  if (menu.i18n) {
    const msgs = menu.i18n;
    for (const locale in msgs)
      i18n.mergeLocaleMessage(locale, msgs[locale]);
  }

  return {
    path: menu.path,
    component: resolve => {
      if (menu.plugin) {
        axios.get(`/views/${menu.view}.js`).then(r => {
          resolve(eval(r.data));
        });
      } else {
        return import(`@/views/${menu.view}`);
      }
    },
    meta: {
      title: menu.title,
      i18nfile: menu.i18nfile
    },
    beforeEnter: (to, from, next) => {
      if (!to.meta.i18nfile) {
        next();
        return;
      }

      to.meta.i18nfile = false;

      axios.get(`/i18n${to.path}.json`).then(r => {
        const msgs = r.data;
        for (const locale in msgs)
          i18n.mergeLocaleMessage(locale, msgs[locale]);
        next();
      }).catch(() => {
        next();
      });
    }
  };
}

function buildRoutes(menus) {
  const routes = [];

  menus.forEach(menu => {
    const route = {
      path: '/',
      component: () => import('@/components/layout'),
      meta: {
        title: menu.title
      },
      children: []
    };

    if (menu.view) {
      route.redirect = menu.path;
      route.children.push(buildRoute(menu));
    } else if (menu.children) {
      menu.children.forEach(sm => {
        route.children.push(buildRoute(sm));
      });
    }

    routes.push(route);
  });

  return routes;
}

menu.load = function(cb) {
  ubus.call('oui.ui', 'menu').then(r => {
    r = {"menu":{"upgrade":{"view":"system/upgrade","title":"Backup / Upgrade","index":55},"status/dmesg":{"view":"status/dmesg","title":"Kernel Log","index":40},"network/firewall":{"view":"network/firewall","title":"Firewall","index":60},"network/dhcp":{"view":"network/dhcp","title":"DHCP/DNS","index":40},"status":{"title":"Status","index":10},"network/switch":{"view":"network/switch","title":"Switch","index":30},"services/upnp":{"plugin":true,"title":"UPnP","i18n":{"en":{"UPnP":"UPnP"},"zh-CN":{"UPnP":"UPnP"}},"index":11,"view":"services/upnp","i18nfile":true},"network/routes":{"view":"network/routes","title":"Routes","index":70},"network/interfaces":{"view":"network/interfaces","title":"Interfaces","index":10},"network":{"title":"Network","index":30},"network/diagnostics":{"view":"network/diagnostics","title":"Diagnostics","index":80},"status/routes":{"view":"status/routes","title":"Routes","index":20},"system/users":{"view":"system/users","title":"User & Acls","index":30},"system":{"title":"System","index":20},"system/system":{"view":"system/system","title":"System","index":10},"system/admin":{"view":"system/admin","title":"Administration","index":20},"status/syslog":{"view":"status/syslog","title":"System Log","index":30},"network/wireless":{"view":"network/wireless","title":"Wireless","index":20},"system/oui-bwm":{"view":"system/oui-bwm","title":"Bandwidth Monitor","index":81}}}
    const menus = parseMenus(r.menu);
    const routes = buildRoutes(menus);
    cb(menus, routes);
  });
}

export default {
  install(Vue) {
    Vue.prototype.$menu = menu;
  }
}
