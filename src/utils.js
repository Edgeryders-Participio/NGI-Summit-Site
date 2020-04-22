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
      MediaQueryIndex() {
        var index = 0;
        if (this.$mq=='md') {
          index = 1;
        }
        return index;
      },
      ElementStyle(element, property) {
        var index = this.MediaQueryIndex();
        if (this.data.style && this.data.style[element] && this.data.style[element][property]) {
          if (this.data.style[element][property][index]) {
            return this.data.style[element][property][index];
          }
          else {
            return this.data.style[element][property][0];
          }
        } else if (this.stylesheet && this.stylesheet[element] && this.stylesheet[element][property]) {
          if (this.stylesheet[element][property][index]) {
            return this.stylesheet[element][property][index];
          } else {
            return this.stylesheet[element][property][0];
          }
        } else {
          return ''
        }
      },
      titleStyle() {
        var styleObj = {
          maxWidth: '',
          textAlign: '',
          backgroundColor: '',
          padding: ''
        };
       
        styleObj["backgroundColor"] = this.ElementStyle('title', 'background');
        styleObj["textAlign"] = this.ElementStyle('title', 'align');
        styleObj["maxWidth"] = this.ElementStyle('title', 'width');
        styleObj["padding"] = this.ElementStyle('title', 'padding');
        return styleObj;
 
      },
      containerStyle() {
        var styleObj = {
          padding: '',
          backgroundColor: ''
        };
        styleObj["backgroundColor"] = this.ElementStyle('container', 'background');
        styleObj["padding"] = this.ElementStyle('container', 'padding');
        return styleObj;
      },
      wrapperStyle() {
        var styleObj = {
          maxWidth: '',
          padding: '',
          backgroundColor: '',
        };
        styleObj["backgroundColor"] = this.ElementStyle('wrapper', 'background');
        styleObj["padding"] = this.ElementStyle('wrapper', 'padding');
        styleObj["maxWidth"] = this.ElementStyle('wrapper', 'width');
        return styleObj;
      },
      titleClassSize() {
        return this.ElementStyle('title', 'size')
      }
  	}
}