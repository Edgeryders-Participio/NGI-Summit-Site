export default {
  methods: {
  	getJson(value) {
    	const doc = new DOMParser().parseFromString(value, "text/html");
    	var json = [...doc.querySelectorAll('code')].map(code => code.textContent);
    	var final = String(json).replace(/\n/g, " ");
    	if (final !== '') {
      		var obj = JSON.parse(final);
      		return obj;
      	} else {
      		return null
      	}
      },
      titleWidth() {
        var styleObj = {
          maxWidth: '85%'
        };
        if (this.$mq=='md') {
          if (this.stylesheet && this.stylesheet.wrapper) {
            styleObj["maxWidth"] = this.stylesheet.title;
          };
          if (this.data.style && this.data.style.wrapper) {
           styleObj["maxWidth"] = this.data.style.title;
          };
        }
        return styleObj;
      },
      wrapperWidth() {
        var styleObj = {
          maxWidth: '85%'
        };
          if (this.stylesheet && this.stylesheet.wrapper && this.stylesheet.wrapper.mobile) {
            styleObj["maxWidth"] = this.stylesheet.wrapper.mobile;
          }
        if (this.$mq=='md') {
          if (this.stylesheet && this.stylesheet.wrapper) {
            styleObj["maxWidth"] = this.stylesheet.wrapper.desktop;
          };
          if (this.data.style && this.data.style.wrapper) {
            styleObj["maxWidth"] = this.data.style.wrapper.desktop;
          };
        }
        return styleObj;
      },
      titleSize() {
        var titleClass = '';
        if (this.$mq=='sm') {
          if (this.stylesheet && this.stylesheet.title) {
            titleClass = this.stylesheet.title.mobile;
          }
          if (this.data.style && this.data.style.title) {
            titleClass = this.data.style.title.mobile;
          }
        }
        if (this.$mq=='md') {
          if (this.stylesheet && this.stylesheet.title) {
            titleClass = this.stylesheet.title.desktop;
          }
          if (this.data.style && this.data.style.title) {
            titleClass = this.data.style.title.desktop;
          }
        }
        return titleClass;
      }
  	}
}