<template>
  <div></div>
</template>

<script>

export default {
  name: "SetManifest",
  components: {},
  data() {
    return {
      
    };
  },
  props: {
    
  },
  watch: {
    
  },
  
  methods: {
    setManifest(){
      let manifestJSON =
      {
        "name": "Assistant",
        "short_name": "Assistant",
        "scope": window.location.protocol +'//' +window.location.host,
        "start_url": window.location.protocol +'//' +window.location.host,
        "display": "standalone",
        "icons":[
            {
                "src":"/img/icons/android-chrome-192x192.png",
                "sizes":"192x192",
                "type":"image/png"
            },
            {
              "src":"/img/icons/android-chrome-512x512.png",
              "sizes":"192x192",
              "type":"image/png"
            },
            {
                "src":"/img/icons/apple-touch-icon.png",
                "sizes":"180x180",
                "type":"image/png"
            },
        ],
        themeColor: "#38424e",
        theme_color: "#38424e",
        msTileColor: "#000",
        background_color: "#38424e",
        backgroundColor: "#38424e",
        manifestOptions: {
          background_color: "#38424e",
          backgroundColor: "#38424e",
          themeColor: "#38424e",
          theme_color: "#38424e",
        }
      };

      const stringManifest = JSON.stringify(manifestJSON);
      const blob = new Blob([stringManifest], {type: 'application/json'});
      const manifestURL = URL.createObjectURL(blob);
      document.querySelector('link[rel="manifest"]').setAttribute('href', manifestURL);
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#38424e');
    }
  },
  created() {
    this.setManifest();
  }
};
</script>

<style scoped lang="less">

</style>
