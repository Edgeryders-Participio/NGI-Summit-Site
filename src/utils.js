import config from "@/data/config.json";
import axios from "axios";
import WebFontLoader from 'webfontloader';

export default {
  data: function() {
    return {
      config,
      globalStyleSheet: null,
      sectionStyle: null,
      sections: null,
      navItems: null
    };
  },
  methods: {
    getUrlStyle(style) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      const font = urlParams.get('font');
      const toggle = urlParams.get('toggle');
      const highlight = urlParams.get('highlight');
      const action = urlParams.get('action');
   
      if (font) {
        WebFontLoader.load({
          google: {
            families: [font]
          }
        });

        var obj = style;

        obj['fonts'] = [font];
        obj['title']['font'] = [font];
        obj['paragraph']['font'] = [font];
        obj['toggle']['background'] = [toggle];
        obj['highlight']['background'] = [highlight];
        obj['action']['background'] = [action];
        this.globalStyleSheet = obj;
        
      }
    },
    getData() {
      if (this.config.configId) {
      axios.get(
        `https://edgeryders.eu/webkit_components/topics.json?serializer=event&tags=webcontent`
      ).then(({ data }) => {
          var post = data.find(post => post.id === this.config.configId);
          var json = this.getJson(post.cooked);
          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);
          const font = urlParams.get('font');
          const toggle = urlParams.get('toggle');
          const highlight = urlParams.get('highlight');
          const action = urlParams.get('action');
          if (font || toggle || highlight || action) {
            this.getUrlStyle(json.style);
          } else {
            this.globalStyleSheet = json.style;
          }
          this.sections = json.sections;
          this.loadFonts(json.style.fonts);
          this.getNavElements(json.sections);
        });
      } else {
        this.sections = this.config.sections;
        this.globalStyleSheet = this.config.style;
        this.loadFonts(this.config.style.fonts);
        this.getNavElements(this.config.sections);
      }
    },
    getNavElements(sections) {
      if (sections.length) {
      var navArray = sections.map(function(el) {
            if (el.id) {
              return {
                title: el.title,
                id: el.id,
              } 
            }
          });
      this.navItems = navArray.filter(function (el) {
          return el != null;
      });
      }
    },
    loadFonts(fontFamily) {
      WebFontLoader.load({
        google: {
          families: fontFamily,
        },
      });
    },
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
      MediaQueryIndex() {
        var index = 0;
        if (this.$mq=='md') {
          index = 1;
        }
        return index;
      },
      applyStyle(element, property) {
        var index = this.MediaQueryIndex();
        var style = '';
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const highlight = urlParams.get('highlight');
        window.console.log(highlight)

        if (this.globalStyle && this.globalStyle[element] && this.globalStyle[element][property]) {
          if (this.globalStyle[element][property][index]) {
            style = this.globalStyle[element][property][index];
          } else {
            style = this.globalStyle[element][property][0];
          }
        } 
    
        if (this.sectionStyle && this.sectionStyle[element] && this.sectionStyle[element][property]) {
          if (this.sectionStyle[element][property][index]) {
            style = this.sectionStyle[element][property][index];
          }
          else {
            style = this.sectionStyle[element][property][0];
          }
        }

        if (highlight !== null && this.globalStyle[element] && this.globalStyle[element][property]) {
          if (this.globalStyle[element][property][index]) {
            style = this.globalStyle[element][property][index];
          } else {
            style = this.globalStyle[element][property][0];
          }
        }
 
  

        return style;
      },
      textStyle(element, style) {
        this.sectionStyle = style;
        var styleObj = {
          maxWidth: this.applyStyle(element, 'width'),
          textAlign: this.applyStyle(element, 'align'),
          background: this.applyStyle(element, 'background'),
          padding: this.applyStyle(element, 'padding'),
          margin: this.applyStyle(element, 'margin'),
          fontFamily: this.applyStyle(element, 'font'),
          fontWeight: this.applyStyle(element, 'weight'),
          borderBottom: this.applyStyle(element, 'border'),
          color: this.applyStyle(element, 'color')
        };
       
        return styleObj;
      },
      uiStyle(element, style) {
        this.sectionStyle = style;
        var background = this.applyStyle(element, 'background');
        if (background == '') {
          background = 'black'
        }
        var color = this.applyStyle(element, 'color');
        if (color == '') {
          color = 'white'
        }
        var styleObj = {
          color: color,
          backgroundColor: background,
          fontWeight: this.applyStyle(element, 'weight'),
          fontFamily: this.applyStyle('paragraph', 'font'),
        };
        return styleObj;
      },
      hoverStyle(style) {
        this.sectionStyle = style;
        var background = this.applyStyle('highlight', 'background', style);
        if (background == '') {
          background = 'black';
        }
        var styleObj = {
          '--hover-border-color': background
        };
        return styleObj;
      },
      containerStyle(style) {
        this.sectionStyle = style;
        var styleObj = {
          padding: this.applyStyle('container', 'padding'),
          backgroundColor: this.applyStyle('container', 'background')
        };
        return styleObj;
      },
      wrapperStyle(style) {
        this.sectionStyle = style;
        var styleObj = {
          maxWidth: this.applyStyle('wrapper', 'width'),
          padding: this.applyStyle('wrapper', 'padding'),
          backgroundColor: this.applyStyle('wrapper', 'background'),
        };
        return styleObj;
      },
      titleClassSize(style) {
        this.sectionStyle = style;
        return this.applyStyle('title', 'size')
      }
  	}
}