<template>
  <v-app-bar id="app-bar" absolute app color="transparent" flat height="75">
    <v-btn class="mr-3" elevation="1" fab small @click="setDrawer(!drawer)">
      <v-icon v-if="value">mdi-view-quilt</v-icon>
      <v-icon v-else>mdi-dots-vertical</v-icon>
    </v-btn>

    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item>{{ $t(item.title) }}</v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>

    <v-spacer />

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          class="ml-2"
          min-width="0"
          max-height="30"
          max-width="30"
          text
          @click="onUserCommand('reboot')"
          v-on="on"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </template>
      <span>{{$t('Reboot')}}</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          class="ml-2"
          min-width="0"
          max-height="30"
          max-width="30"
          text
          @click="onUserCommand('logout')"
          v-on="on"
        >
          <v-icon>mdi-login-variant</v-icon>
        </v-btn>
      </template>
      <span>{{$t('Logout')}}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          class="ml-2"
          min-width="0"
          max-height="30"
          max-width="30"
          text
          @click="fullScreen"
          v-on="on"
        >
          <v-icon>mdi-fullscreen</v-icon>
        </v-btn>
      </template>
      <span>{{isfullScreen ? $t('Exit Full Screen') : $t('Full Screen')}}</span>
    </v-tooltip>
    <v-menu offset-y transition="scale-transition">
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          <v-icon left>mdi-translate</v-icon>
          <span style="margin-right:8px">{{ $t('Language') }}</span>
          <v-icon left>mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item-group v-model="lang" color="success">
          <v-list-item @click="onLangCommand('en')">
            <v-list-item-title>English</v-list-item-title>
          </v-list-item>
          <v-list-item @click="onLangCommand('zh-CN')">
            <v-list-item-title>中文</v-list-item-title>
          </v-list-item>
          <v-list-item @click="onLangCommand('auto')">
            <v-list-item-title>{{ $t('Automatic') }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
// Components
//import { VHover, VListItem } from "vuetify/lib";

// Utilities
import { mapState, mapMutations } from "vuex";

export default {
  name: "DashboardCoreAppBar",

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    isfullScreen: false,
    breadcrumbs: [],
    lang: 0
  }),

  computed: {
    ...mapState(["drawer"])
  },

  methods: {
    fullScreen() {
      if (this.isfullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        const docElm = document.documentElement;
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen();
        }
      }

      this.isfullScreen = !this.isfullScreen;
    },
    getBreadCrumbList(route) {
      const homeRoute = this.$router.options.routes[1].children[0];
      const homeItem = { title: homeRoute.meta.title };
      const matched = route.matched;
      if (matched.some(item => item.path === "/home")) return [homeItem];

      homeItem.to = "/home";

      const list = [matched[0].meta];

      if (!matched[0].redirect) list.push(matched[1].meta);

      return list;
    },
    onLangCommand(cmd) {
      this.$ubus.call("oui.ui", "lang", { lang: cmd }).then(({ lang }) => {
        this.$store.commit("setLang", lang);
        if (lang === "auto") lang = navigator.language;
        this.$i18n.locale = lang;
      });
    },
    onUserCommand(cmd) {
      if (cmd === "logout") {
        this.$router.push("/login");
      } else if (cmd === "reboot") {
        this.$dialog
          .confirm({
            text: this.$t("Really reboot now?"),
            title: this.$t("Reboot"),
            actions: {
              false: this.$t("Cancel"),
              true: { text: this.$t("OK"), color: "success" }
            }
          })
          .then(res => {
            if (res) {
              this.$system.reboot().then(() => {
                this.$reconnect("Rebooting...");
              });
            }
          });
      }
    },
    ...mapMutations({
      setDrawer: "SET_DRAWER"
    })
  },
  watch: {
    $route(newRoute) {
      this.breadcrumbs = this.getBreadCrumbList(newRoute);
    }
  },
  created() {
    this.breadcrumbs = this.getBreadCrumbList(this.$route);
    switch (this.$store.state.lang) {
      case "en":
        this.lang = 0;
        return;
      case "zh-CN":
        this.lang = 1;
        return;
      case "auto":
        this.lang = 2;
        return;
    }
  }
};
</script>
