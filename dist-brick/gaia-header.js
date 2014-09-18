(function (define) {
    'use strict';
    define(function (require, exports, module) {
        var loadGaiaIcons = require('gaia-icons');
        var fontFit = require('./lib/font-fit');
        var baseComponents = window.COMPONENTS_BASE_URL || 'bower_components/';
        var proto = Object.create(HTMLElement.prototype);
        var actionTypes = {
            menu: true,
            back: true,
            close: true
        };
        proto.createdCallback = function () {
            var shadow = this.createShadowRoot();
            var tmpl = template.content.cloneNode(true);
            this.els = {
                actionButton: tmpl.querySelector('.action-button'),
                headings: this.querySelectorAll('h1,h2,h3,h4'),
                inner: tmpl.querySelector('.inner')
            };
            this.els.actionButton.addEventListener('click', proto.onActionButtonClick.bind(this));
            this.configureActionButton();
            this.setupInteractionListeners();
            shadow.appendChild(tmpl);
            this.styleHack();
            this.runFontFit();
        };
        proto.styleHack = function () {
            var style = this.shadowRoot.querySelector('style').cloneNode(true);
            this.classList.add('-content', '-host');
            style.setAttribute('scoped', '');
            this.appendChild(style);
        };
        proto.attachedCallback = function () {
            this.shadowStyleHack();
            this.rerunFontFit();
        };
        proto.shadowStyleHack = function () {
            var style = this.shadowRoot.querySelector('style');
            this.shadowRoot.removeChild(style);
            this.shadowRoot.appendChild(style);
        };
        proto.rerunFontFit = function () {
            for (var i = 0; i < this.els.headings.length; i++) {
                this.els.headings[i].textContent = this.els.headings[i].textContent;
            }
        };
        proto.runFontFit = function () {
            for (var i = 0; i < this.els.headings.length; i++) {
                fontFit.reformatHeading(this.els.headings[i]);
                fontFit.observeHeadingChanges(this.els.headings[i]);
            }
        };
        proto.attributeChangedCallback = function (attr, oldVal, newVal) {
            if (attr === 'action') {
                this.configureActionButton();
                fontFit.reformatHeading(this._heading);
            }
        };
        proto.triggerAction = function () {
            if (this.isSupportedAction(this.getAttribute('action'))) {
                this.els.actionButton.click();
            }
        };
        proto.configureActionButton = function () {
            var old = this.els.actionButton.getAttribute('icon');
            var type = this.getAttribute('action');
            var supported = this.isSupportedAction(type);
            this.els.actionButton.classList.remove('icon-' + old);
            this.els.actionButton.setAttribute('icon', type);
            this.els.inner.classList.toggle('supported-action', supported);
            if (supported) {
                this.els.actionButton.classList.add('icon-' + type);
            }
        };
        proto.isSupportedAction = function (action) {
            return action && actionTypes[action];
        };
        proto.onActionButtonClick = function (e) {
            var config = { detail: { type: this.getAttribute('action') } };
            var actionEvent = new CustomEvent('action', config);
            setTimeout(this.dispatchEvent.bind(this, actionEvent));
        };
        proto.setupInteractionListeners = function () {
            stickyActive(this.els.inner);
        };
        var template = document.createElement('template');
        template.innerHTML = '\n<style>/*\nbase.css\nBase styles\n- resets, base variables used in all themes\n- layout helpers, alignment\n*/\n\n/* defaults */\n\n*,\n*:before,\n*:after {\n  /* apply a natural box layout model to all elements */\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n* {\n  font-family: "FiraSans";\n}\n\nhtml,\nbody {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n  color: #858585;\n  font-weight: normal;\n  line-height: 19px;\n  font-size: 17px;\n}\n\n/* variables */\n\n:root {\n  /* base colors */\n}\n\n/* type classes */\n\na {\n  color: #000;\n  text-decoration: none;\n  font-style: italic;\n  /* todo: should be normal, but looks thin.  font issue? */\n  /*font-weight: bold; */\n}\n\nh1,\n.alpha {\n  font-size: 23px;\n  font-weight: lighter;\n  font-style: italic;\n  line-height: 26px;\n  color: #4d4d4d;\n  margin: 6px 0 24px 0;\n}\n\nh2,\n.beta {\n  font-size: 17px;\n  color: #4d4d4d;\n  margin: 32px 0 16px 0;\n}\n\nh3,\n.gamma {\n  font-size: 14px;\n  font-style: bold;\n  text-transform: uppercase;\n  font-weight: normal;\n  color: #4d4d4d;\n  margin: 32px 0 16px 0;\n}\n\nem {\n  font-weight: normal;\n}\n\n.mega {\n  font-size: 60px;\n  line-height: 60px;\n  font-style: normal;\n}\n\n.large {\n  font-size: 23px;\n  line-height: 26px;\n}\n\nsmall,\n.milli {\n  font-size: 14px;\n}\n\n/* layout classes */\n\n/* grid */\n\n.grid:after {\n  /* clearfix */\n  content: "";\n  display: table;\n  clear: both;\n}\n\n[class*=\'col-\'] {\n  float: left;\n}\n\n.col-1-2 {\n  width: 50%;\n}\n\n/* 2 col */\n\n.col-1-3 {\n  width: 33.33%;\n}\n\n/* 3 col */\n\n.col-2-3 {\n  width: 66.66%;\n}\n\n.col-1-4 {\n  width: 25%;\n}\n\n/* 4 col */\n\n.col-2-4 {\n  width: 50%;\n}\n\n.col-3-4 {\n  width: 75%;\n}\n\n/* alignment */\n\n.l-align-right {\n  float: right;\n}\n\n.l-align-left {\n  float: left;\n}\n\n.l-align-center {\n  text-align: center;\n}\n\n.l-text-align-left {\n  text-align: left;\n}\n\n.l-text-align-right {\n  text-align: right;\n}\n\n.l-text-valign-top {\n  vertical-align: top;\n}\n\n.l-width-full {\n  width: 100%;\n}\n\n/* flexbox */\n\n/* flex-item */\n\n.l-flex-grow {\n  -webkit-flex-grow: 1;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n}\n\n/* margin-top */\n\n.l-mt-small {\n  margin-top: 16px;\n}\n\n/* margin-bottom */\n\n.l-mb-small {\n  margin-bottom: 16px;\n}\n\n.l-mb-mega {\n  margin-bottom: 60px;\n}\n\n/* margin-left */\n\n.l-ml-small {\n  margin-left: 16px;\n}\n\n/* margin-right */\n\n.l-mr-small {\n  margin-right: 16px;\n}\n\n/* margin */\n\n.l-m-small {\n  margin: 16px;\n}\n\n/* paddig */\n\n.l-p-small {\n  padding: 16px;\n}\n\n.l-pl-small {\n  padding-left: 16px;\n}\n\n.l-pr-small {\n  padding-right: 16px;\n}\n\n.l-pt-micro {\n  padding-top: 6px;\n}\n\n.l-pb-micro {\n  padding-bottom: 6px;\n}\n\nhr {\n  border: none;\n  background: #e7e7e7;\n  height: 1px;\n  margin: 16px 0 16px 0;\n}\n\n/* helpers */\n\n.l-clearfix:after {\n  content: "";\n  display: table;\n  clear: both;\n}\n\n.l-inline-block {\n  display: inline-block;\n}\n\n.is-hidden {\n  display: none!important;\n}\n\n/* text input */\n\n/* \nto be replaced by web component\nbug: ;\nblocking bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1026164\n*/\n\n.icon {\n  color: inherit;\n}\n\n/* menu layout */\n\n.menu {\n  padding: 0;\n  margin: 0;\n  width: 100%;\n}\n\n.menu-item {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  list-style: none;\n  padding: 16px 16px;\n  color: #4d4d4d;\n  position: relative;\n  z-index: 1;\n  overflow: hidden;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  position: relative;\n}\n\n.menu-item:after {\n  content: " ";\n  position: absolute;\n  bottom: 0px;\n  left: 16px;\n  width: calc(100% - 16px * 2);\n  height: 1px;\n  margin-left: auto;\n  margin-right: auto;\n  background: #e7e7e7;\n}\n\n.menu-item:last-child:after {\n  display: none;\n}\n\n.menu-item-selected {\n  /* for animated click effect */\n  content: " ";\n  position: absolute;\n  border-radius: 50%;\n  -webkit-transform-origin: center center;\n  -ms-transform-origin: center center;\n  transform-origin: center center;\n  background: #e7e7e7;\n  -webkit-transform: scaleX(0);\n  -ms-transform: scaleX(0);\n  transform: scaleX(0);\n  z-index: -1;\n}\n\n.menu-item-animate {\n  -webkit-animation-name: grow;\n  animation-name: grow;\n  -webkit-animation-duration: 800ms;\n  animation-duration: 800ms;\n  animation-iteration: 1;\n}\n\n.menu-item-icon {\n  font-size: 25px;\n  width: 28px;\n  text-align: center;\n}\n\n.menu-item .icon-forward {\n  /* to do: replace with standard icon sizing variables */\n  font-size: 20px;\n}\n\n.menu-item > a {\n  text-decoration: none;\n  font-style: normal;\n  font-weight: normal;\n  color: #4d4d4d;\n}\n\n@-webkit-keyframes grow {\n  0% {\n    -webkit-transform: scale(0);\n    transform: scale(0);\n  }\n\n  50% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n  }\n\n  50% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    opacity: 1;\n  }\n\n  80% {\n    opacity: 1;\n  }\n\n  100% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    opacity: 0;\n  }\n}\n\n@keyframes grow {\n  0% {\n    -webkit-transform: scale(0);\n    transform: scale(0);\n  }\n\n  50% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n  }\n\n  50% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    opacity: 1;\n  }\n\n  80% {\n    opacity: 1;\n  }\n\n  100% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    opacity: 0;\n  }\n}\n\n.menu-item:last-child {\n  border-bottom: none;\n}\n\n.menu-item-icon {\n  font-size: 30px;\n  margin: -10px 16px -10px 0;\n}\n\n.spinner {\n  display: inline-block;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  background: #000;\n  -webkit-transform: perspective(200px);\n  transform: perspective(200px);\n}\n\n.spinner-in {\n  -webkit-animation-name: spinup;\n  animation-name: spinup;\n  -webkit-animation-duration: 1s;\n  animation-duration: 1s;\n  -webkit-animation-timing-function: ease-in-out;\n  animation-timing-function: ease-in-out;\n}\n\n.spinner-out {\n  -webkit-animation-name: spinout;\n  animation-name: spinout;\n  -webkit-animation-duration: 1s;\n  animation-duration: 1s;\n  -webkit-animation-timing-function: ease-in;\n  animation-timing-function: ease-in;\n}\n\n.spinner-loop {\n  -webkit-animation-name: spin;\n  animation-name: spin;\n  -webkit-animation-duration: 1s;\n  animation-duration: 1s;\n  -webkit-animation-iteration-count: infinite;\n  animation-iteration-count: infinite;\n  -webkit-animation-timing-function: linear;\n  animation-timing-function: linear;\n  -webkit-animation-direction: alternate;\n  animation-direction: alternate;\n}\n\n@-webkit-keyframes spinup {\n  0% {\n    -webkit-transform: rotateX(0deg) rotateY(0deg) rotateX(90deg) translateX(-30px) translateY(0px);\n    transform: rotateX(0deg) rotateY(0deg) rotateX(90deg) translateX(-30px) translateY(0px);\n    -webkit-transform-origin: top 25%;\n    transform-origin: top 25%;\n    /*background: var(--color-brand-blue);*/\n  }\n\n  100% {\n    -webkit-transform: rotateX(0deg) rotateY(360deg) rotateX(5deg) translateX(2px) translateY(0px);\n    transform: rotateX(0deg) rotateY(360deg) rotateX(5deg) translateX(2px) translateY(0px);\n    -webkit-transform-origin: top 55%;\n    transform-origin: top 55%;\n    /*background: #0095dd;*/\n  }\n}\n\n@keyframes spinup {\n  0% {\n    -webkit-transform: rotateX(0deg) rotateY(0deg) rotateX(90deg) translateX(-30px) translateY(0px);\n    transform: rotateX(0deg) rotateY(0deg) rotateX(90deg) translateX(-30px) translateY(0px);\n    -webkit-transform-origin: top 25%;\n    transform-origin: top 25%;\n    /*background: var(--color-brand-blue);*/\n  }\n\n  100% {\n    -webkit-transform: rotateX(0deg) rotateY(360deg) rotateX(5deg) translateX(2px) translateY(0px);\n    transform: rotateX(0deg) rotateY(360deg) rotateX(5deg) translateX(2px) translateY(0px);\n    -webkit-transform-origin: top 55%;\n    transform-origin: top 55%;\n    /*background: #0095dd;*/\n  }\n}\n\n@-webkit-keyframes spinout {\n  0% {\n    -webkit-transform: rotateX(0deg) rotateY(540deg) rotateX(5deg) translateX(2px) translateY(0px);\n    transform: rotateX(0deg) rotateY(540deg) rotateX(5deg) translateX(2px) translateY(0px);\n    -webkit-transform-origin: top 55%;\n    transform-origin: top 55%;\n    /*background: #0095dd;*/\n  }\n\n  100% {\n    -webkit-transform: rotateX(0deg) rotateY(0deg) rotateX(90deg) translateX(0px) translateY(0px);\n    transform: rotateX(0deg) rotateY(0deg) rotateX(90deg) translateX(0px) translateY(0px);\n    -webkit-transform-origin: top 25%;\n    transform-origin: top 25%;\n    /*background: var(--color-brand-blue);*/\n  }\n}\n\n@keyframes spinout {\n  0% {\n    -webkit-transform: rotateX(0deg) rotateY(540deg) rotateX(5deg) translateX(2px) translateY(0px);\n    transform: rotateX(0deg) rotateY(540deg) rotateX(5deg) translateX(2px) translateY(0px);\n    -webkit-transform-origin: top 55%;\n    transform-origin: top 55%;\n    /*background: #0095dd;*/\n  }\n\n  100% {\n    -webkit-transform: rotateX(0deg) rotateY(0deg) rotateX(90deg) translateX(0px) translateY(0px);\n    transform: rotateX(0deg) rotateY(0deg) rotateX(90deg) translateX(0px) translateY(0px);\n    -webkit-transform-origin: top 25%;\n    transform-origin: top 25%;\n    /*background: var(--color-brand-blue);*/\n  }\n}\n\n@-webkit-keyframes spin {\n  0% {\n    -webkit-transform: rotateX(0deg) rotateY(0deg) rotateX(10deg) translateX(0px);\n    transform: rotateX(0deg) rotateY(0deg) rotateX(10deg) translateX(0px);\n    -webkit-transform-origin: top 25%;\n    transform-origin: top 25%;\n    /*background: var(--color-brand-blue);*/\n  }\n\n  100% {\n    -webkit-transform: rotateX(0deg) rotateY(360deg) rotateX(5deg) translateX(2px);\n    transform: rotateX(0deg) rotateY(360deg) rotateX(5deg) translateX(2px);\n    -webkit-transform-origin: top 55%;\n    transform-origin: top 55%;\n    /*background: #0095dd;*/\n  }\n}\n\n@keyframes spin {\n  0% {\n    -webkit-transform: rotateX(0deg) rotateY(0deg) rotateX(10deg) translateX(0px);\n    transform: rotateX(0deg) rotateY(0deg) rotateX(10deg) translateX(0px);\n    -webkit-transform-origin: top 25%;\n    transform-origin: top 25%;\n    /*background: var(--color-brand-blue);*/\n  }\n\n  100% {\n    -webkit-transform: rotateX(0deg) rotateY(360deg) rotateX(5deg) translateX(2px);\n    transform: rotateX(0deg) rotateY(360deg) rotateX(5deg) translateX(2px);\n    -webkit-transform-origin: top 55%;\n    transform-origin: top 55%;\n    /*background: #0095dd;*/\n  }\n}\n\n.subheader {\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  margin: 16px 0 0 0;\n  padding: 0 16px 0 16px;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n}\n\n.subheader-line {\n  background: #a6a6a6;\n  height: 1px;\n  position: relative;\n}\n\n.subheader-label {\n  color: #a6a6a6;\n  margin: 0 16px 0 16px;\n  padding: 0;\n}\n\n.subheader-label a {\n  font-weight: inherit;\n  font-style: inherit;\n  color: #000;\n}\n\n.subheader-link-label {\n  color: #000;\n  position: relative;\n  padding-right: 16px;\n}\n\n.subheader-link-label:after {\n  content: " ";\n  position: absolute;\n  width: 0px;\n  height: 0px;\n  top: 3px;\n  right: 0px;\n  border-bottom: 10px solid #000;\n  border-left: 10px solid transparent;\n}\n\n.input-label {\n  font-size: 14px;\n  display: block;\n  margin: 16px 0 4px 16px;\n}\n\n.input-container {\n  display: inline-block;\n  width: 100%;\n  min-height: 40px;\n  border: 1px solid #d6d6d6;\n  position: relative;\n}\n\n.input {\n  width: 100%;\n  min-height: 40px;\n  font-size: inherit;\n  width: 100%;\n  border: none;\n  padding: 0 16px;\n  margin: 0;\n  color: #333333;\n  background: rgba(255,255,255,0.5);\n}\n\n.input::-moz-placeholder {\n  font-style: italic;\n  font-weight: lighter;\n  color: #909ca7;\n}\n\n.input:focus {\n  background: rgba(255,255,255,1);\n}\n\n.input:focus~.input-focus {\n  -webkit-transform: scaleX(1);\n  -ms-transform: scaleX(1);\n  transform: scaleX(1);\n  -webkit-transition-delay: 300ms;\n  transition-delay: 300ms;\n}\n\n.input:focus~.input-clear {\n  opacity: 1;\n}\n\n.input-clear {\n  position: absolute;\n  top: 12px;\n  right: 10px;\n  background: #909ca7;\n  width: 17px;\n  height: 17px;\n  border-radius: 50%;\n  opacity: 0;\n  color: #fff;\n}\n\n.input-clear-icon {\n  /* to do: replace with standard icon sizing variables */\n  font-size: 19px;\n  margin-left: 4px;\n  margin-top: -1px;\n  display: block;\n}\n\n.input-focus {\n  position: absolute;\n  bottom: 0px;\n  width: 100%;\n  height: 3px;\n  -webkit-transition: all 200ms;\n  transition: all 200ms;\n  -webkit-transform: scaleX(0);\n  -ms-transform: scaleX(0);\n  transform: scaleX(0);\n  background: #000;\n}\n\n.input-search-container {\n  border-radius: 30px;\n  overflow: hidden;\n}\n\n.input-search {\n  border-radius: 20px;\n}\n\n.input-passcode {\n  width: 40px;\n}\n\n.input-range-label {\n  font-style: italic;\n  color: #000;\n  font-weight: bold;\n  text-align: bottom;\n  position: relative;\n  top: 15px;\n}\n\n.input-range-container {\n  position: relative;\n}\n\n.input-range-track {\n  width: 100%;\n  top: calc(50% - 1.5px);\n  left: 0px;\n  position: absolute;\n  height: 3px;\n  background: #c7c7c7;\n}\n\n.input-range-range {\n  background: #000;\n  width: 50%;\n}\n\n.input-range-handle {\n  width: 34px;\n  height: 34px;\n  border-radius: 17px;\n  background: #fff;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  border: 1px solid #000;\n  position: relative;\n  z-index: 100;\n  left: 50%;\n  -webkit-transition: all 0.2s;\n  transition: all 0.2s;\n  -webkit-transition-delay: 300ms;\n  transition-delay: 300ms;\n}\n\n.input-range-handle:active {\n  box-shadow: 0 0 0 2px #000;\n  /* does\'t look good! */\n  border: 1px solid #000;\n  -webkit-transition: none;\n  transition: none;\n}\n\n.input-range-handle:after {\n  content: " ";\n  position: absolute;\n  width: 250%;\n  height: 250%;\n  top: -75%;\n  left: -75%;\n  border-radius: 50%;\n  border: 23px solid #000;\n  opacity: 0;\n  -webkit-transform: scale(0.5);\n  -ms-transform: scale(0.5);\n  transform: scale(0.5);\n  -webkit-transition: all 0.2s cubic-bezier(0.175, 0.885, 0.320, 1.275);\n  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.320, 1.275);\n  /*transition-delay:  var(--button-transition-delay);*/\n}\n\n.input-range-handle:active:after {\n  opacity: 0.2;\n  -webkit-transform: scale(1);\n  -ms-transform: scale(1);\n  transform: scale(1);\n}\n\n/* tab bar */\n\n/* toolbars are the same as tabs.  except for some exceptions on psuedo state */\n\n.tabs {\n  border-top: 1px solid #f4f4f4;\n  margin: 0;\n  padding: 0;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n}\n\n.tabs-item {\n  text-align: center;\n  font-style: italic;\n  height: 45px;\n  line-height: 45px;\n  -webkit-transition: all 0.2s;\n  transition: all 0.2s;\n  -webkit-transition-delay: 300ms;\n  transition-delay: 300ms;\n  cursor: pointer;\n  -webkit-flex-grow: 1;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n}\n\n.tabs-item-icon {\n  /* to do: replace with standard icon sizing variables */\n  font-size: 30px;\n  line-height: 45px;\n}\n\n.tabs-item:active {\n  -webkit-transition: none;\n  transition: none;\n  opacity: 0.3;\n}\n\n.toolbars-item:active {\n  color: #000;\n  opacity: 1;\n}\n\n.tabs-item-selected {\n  color: #000;\n}\n\n.tabs-selected-indicator {\n  position: absolute;\n  bottom: 0px;\n  left: 0px;\n  width: 0px;\n  height: 3px;\n  background: #000;\n  -webkit-transition: all 0.2s;\n  transition: all 0.2s;\n}\n\n/* progress */\n\n.progress {\n  height: 4px;\n  background: #e7e7e7;\n  position: relative;\n}\n\n.progress-line {\n  width: 80%;\n  height: 0px;\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  height: 0px;\n  border-top: 4px solid #00caf2;\n  border-right: 4px solid transparent;\n}\n\n/*.progress:after {\n    content: " ";\n    display: block;\n    background: var(--color-brand-blue);\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    width: 50%;\n    height: 100%;\n}*/\n\n.infiniteprogress {\n  height: 4px;\n  background: #e7e7e7;\n  position: relative;\n}\n\n/* confirmation */\n\n.dialogue-container {\n  background: rgba(199,199,199,0.85);\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  -webkit-justify-content: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  z-index: 200;\n  font-style: italic;\n}\n\n.dialogue-container-in {\n  -webkit-animation-name: fadeIn;\n  animation-name: fadeIn;\n  -webkit-animation-duration: 0.3s;\n  animation-duration: 0.3s;\n}\n\n.dialogue-container-out {\n  -webkit-animation-name: fadeOut;\n  animation-name: fadeOut;\n  -webkit-animation-delay: 0.3s;\n  animation-delay: 0.3s;\n  -webkit-animation-duration: 0.3s;\n  animation-duration: 0.3s;\n}\n\n.dialogue {\n  background: #f4f4f4;\n  max-height: 75%;\n  max-width: 350px;\n  width: 90%;\n  margin: auto;\n}\n\n.dialogue .menu {\n  max-height: 250px;\n  overflow: hidden;\n}\n\n.dialogue-in {\n  opacity: 1;\n  -webkit-animation-name: translateIn;\n  animation-name: translateIn;\n  -webkit-animation-duration: 0.3s;\n  animation-duration: 0.3s;\n  -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.320, 1.275);\n  animation-timing-function: cubic-bezier(0.175, 0.885, 0.320, 1.275);\n}\n\n.dialogue-out {\n  -webkit-animation-name: fadeOut;\n  animation-name: fadeOut;\n  -webkit-animation-delay: 0.2s;\n  animation-delay: 0.2s;\n  -webkit-animation-duration: 0.2s;\n  animation-duration: 0.2s;\n  -webkit-animation-timing-function: linear;\n  animation-timing-function: linear;\n}\n\n@-webkit-keyframes translateIn {\n  0% {\n    opacity: 0;\n    -webkit-transform: translateY(100px);\n    transform: translateY(100px);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: translateY(0px);\n    transform: translateY(0px);\n  }\n}\n\n@keyframes translateIn {\n  0% {\n    opacity: 0;\n    -webkit-transform: translateY(100px);\n    transform: translateY(100px);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: translateY(0px);\n    transform: translateY(0px);\n  }\n}\n\n@-webkit-keyframes fadeIn {\n  0% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@keyframes fadeIn {\n  0% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@-webkit-keyframes fadeOut {\n  0% {\n    opacity: 1;\n  }\n\n  100% {\n    opacity: 0;\n  }\n}\n\n@keyframes fadeOut {\n  0% {\n    opacity: 1;\n  }\n\n  100% {\n    opacity: 0;\n  }\n}\n\n.dialogue-buttons {\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.dialogue-buttons-vertical {\n  -webkit-flex-direction: column;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  position: relative;\n}\n\n.dialogue-buttons-vertical .dialogue-button {\n  position: relative;\n}\n\n.dialogue-buttons-vertical .dialogue-button:after {\n  position: absolute;\n  width: calc(100% - 6px * 2);\n  height: 1px;\n  bottom: 0px;\n  left: 6px;\n  top: 49px;\n  background: #e7e7e7;\n}\n\n.dialogue-button {\n  height: 50px;\n  font-weight: lighter;\n  font-style: italic;\n  font-size: 17px;\n  -webkit-flex-grow: 1;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  margin: 0;\n  border: 0;\n  padding: 0rem 25px;\n  background: #ffffff;\n  color: #00caf2;\n  -webkit-transition: all 0.2;\n  transition: all 0.2;\n  -webkit-transition-delay: 300ms;\n  transition-delay: 300ms;\n  position: relative;\n}\n\n.dialogue-button:after {\n  content: " ";\n  position: absolute;\n  height: calc(100% - 6px * 2);\n  width: 1px;\n  top: 6px;\n  right: 0px;\n  background: #e7e7e7;\n  z-index: 1;\n}\n\n.dialogue-button:active {\n  background-color: #00caf2;\n  color: #fff;\n  -webkit-transition: none;\n  transition: none;\n}\n\n.dialogue-button:active:after {\n  z-index: -1;\n}\n\n.dialogue-button:last-child:after {\n  display: none;\n}\n\n.dialogue-objectmenu-button {\n  text-align: left;\n}\n\n.dialogue-button-icon {\n  /* to do: replace with standard icon sizing variables */\n  font-size: 25px;\n  margin: -2px;\n  width: 20px;\n  display: inline-block;\n  margin-right: 16px;\n}\n\n.dialogue .dialogue-option-selected {\n  color: #00caf2;\n  font-weight: bold;\n}\n\n.dialogue-option-selected-tick {\n  color: #00caf2;\n  font-size: 32px;\n  line-height: 75px;\n  margin: -25px 0 -25px 0;\n}\n\n/*\nvalue selector\n*/\n\n.dialogue-spinner {\n  position: relative;\n}\n\n.dialogue-spinner ul,\n.dialogue-spinner li {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  text-align: center;\n}\n\n.dialogue-spinner-range ul {\n  height: 200px;\n  overflow: hidden;\n  position: relative;\n  z-index: 90;\n}\n\n.dialogue-spinner-range li {\n  line-height: 42px;\n  border-right: 1px solid gray;\n}\n\n.dialogue-spinner-range ul:last-child li {\n  border-right: none;\n}\n\n.dialogue-spinner-range ul:before {\n  content: " ";\n  position: absolute;\n  width: 100%;\n  height: 60px;\n  top: 0px;\n  left: 0px;\n  background: -webkit-linear-gradient(top, rgba(244, 244, 244, 1), rgba(244, 244, 255, 0));\n  background: linear-gradient(to bottom, rgba(244, 244, 244, 1),  rgba(244, 244, 255, 0));\n}\n\n.dialogue-spinner-range ul:after {\n  content: " ";\n  position: absolute;\n  width: 100%;\n  height: 60px;\n  bottom: 0px;\n  left: 0px;\n  background: -webkit-linear-gradient(top, rgba(244, 244, 244, 0), rgba(244, 244, 255, 1));\n  background: linear-gradient(to bottom, rgba(244, 244, 244, 0),  rgba(244, 244, 255, 1));\n}\n\n.dialogue-spinner-selected {\n  position: absolute;\n  z-index: 100;\n  width: 100%;\n  top: 166px;\n}\n\n.dialogue-spinner-selected li {\n  background: #ffffff;\n  color: #00caf2;\n  font-size: 27px;\n  padding: 15px;\n  font-weight: bold;\n}\n\n.banner-container {\n  position: fixed;\n  left: 0px;\n  bottom: 25px;\n  width: 100%;\n  text-align: center;\n  z-index: 200;\n}\n\n.banner {\n  display: inline-block;\n  width: 90%;\n  height: 50px;\n  line-height: 50px;\n  bottom: 15px;\n  background: #ffffff;\n  text-align: center;\n  opacity: 0;\n}\n\n.banner-animate {\n  -webkit-animation-name: fadein-out;\n  animation-name: fadein-out;\n  -webkit-animation-duration: 3s;\n  animation-duration: 3s;\n}\n\n@-webkit-keyframes fadein-out {\n  0% {\n    opacity: 0;\n    -webkit-transform: translateY(25px);\n    transform: translateY(25px);\n  }\n\n  25% {\n    opacity: 1;\n    -webkit-transform: translateY(0);\n    transform: translateY(0);\n  }\n\n  80% {\n    opacity: 1;\n  }\n\n  100% {\n    oapcity: 0;\n  }\n}\n\n@keyframes fadein-out {\n  0% {\n    opacity: 0;\n    -webkit-transform: translateY(25px);\n    transform: translateY(25px);\n  }\n\n  25% {\n    opacity: 1;\n    -webkit-transform: translateY(0);\n    transform: translateY(0);\n  }\n\n  80% {\n    opacity: 1;\n  }\n\n  100% {\n    oapcity: 0;\n  }\n}\n\n/*\ntodo: active states;\n*/\n\n.dialogue-button-warning {\n  color: #ff9500;\n}\n\n/*\nGaia theme variables\n*/\n\n:root {\n  /* brand colors */\n  /* base dimensions */\n  /* font dimensions */\n  /* module styles  */\n  /* generic styles */\n}\n\n/* sub-theme specific variables */\n\n.theme-productivity {\n  /* generic styles */\n  --highlight-color: #ff9500;\n  /* module styles */\n  --header-background: #ff9500;\n  --header-nav-button-color: #ffffff;\n  --header-nav-button-color-active: rgba(255,255,255,0.2);\n  --header-button-color: #ffffff;\n  --header-button-color-active: rgba(255,255,255,0.2);\n  --header-button-background: transparent;\n  --header-title-color: #ffffff;\n  --button-background-active: #ff9500;\n  --button-color: #333333;\n  --button-color-active: #ffffff;\n  --checkbox-color: #ff9500;\n  --switch-color-checked: #ff9500;\n}\n\n.theme-communications {\n  /* generic styles */\n  --highlight-color: #27c8c2;\n  /* module styles */\n  --header-background: #27c8c2;\n  --header-nav-button-color: #ffffff;\n  --header-nav-button-color-active: rgba(255,255,255,0.2);\n  --header-button-color: #177874;\n  --header-button-color-active: rgba(23,120,116,0.2);\n  --header-button-background: transparent;\n  --header-title-color: #ffffff;\n  --button-background: #ffffff;\n  --button-background-active: #27c8c2;\n  --button-color: #333333;\n  --button-color-active: #ffffff;\n  --switch-color-checked: #27c8c2;\n  --switch-color: #a6a6a6;\n  --checkbox-color: #27c8c2;\n}\n\n.theme-settings {\n  /* generic styles */\n  --highlight-color: #00caf2;\n  /* module styles */\n  --header-background: #f4f4f4;\n  --header-nav-button-color: #333333;\n  --header-nav-button-color-active: rgba(51,51,51,0.2);\n  --header-button-color: #00caf2;\n  --header-button-background: transparent;\n  --header-button-color-active: rgba(0,202,242,0.2);\n  --header-title-color: #333333;\n  --button-background-active: #00caf2;\n  --button-background: #ffffff;\n  --button-color-active: #ffffff;\n  /* container styles */\n  background: #f4f4f4;\n}\n\n.theme-media {\n  /* generic styles */\n  --highlight-color: #00caf2;\n  /* module styles */\n  --header-background: #4d4d4d;\n  --header-nav-button-color: #ffffff;\n  --header-nav-button-color-active: rgba(255,255,255,0.2);\n  --header-button-color: #00caf2;\n  --header-button-color-active: rgba(0,170,197,0.3);\n  --header-button-background: transparent;\n  --header-title-color: #ffffff;\n  --button-background: #5f5f5f;\n  --button-background-active: #00caf2;\n  --button-color: #ffffff;\n  --button-color-active: #ffffff;\n  --button-boxshadow: \'none\';\n  --switch-color: #5f5f5f;\n  --switch-color-checked: #00caf2;\n  /* container styles  */\n  color: #c7c7c7;\n  background: #333333;\n}\n\n/* overrides */\n\n.theme-media h1,\n.theme-media .alpha,\n.theme-media h2,\n.theme-media .beta,\n.theme-media h3,\n.theme-media .gamma {\n  color: #fff;\n}\n\n.theme-media .subheader-link-label {\n  color: #000;\n}\n\n.theme-media .subheader-line {\n  background: #4d4d4d;\n}\n\n.theme-media .menu-item {\n  color: #c7c7c7;\n}\n\n.theme-media .menu-item a {\n  color: inherit;\n}\n\n.theme-media .menu-item:after {\n  background: #4d4d4d;\n}\n\n.theme-media .menu-item-selected {\n  background: #4d4d4d;\n}\n\n.theme-media .input-container {\n  border-color: #4d4d4d;\n}\n\n.theme-media .input {\n  background: #333333;\n}\n\n.theme-media .input:focus {\n  background: #4d4d4d;\n}\n\n.theme-media .input-range-track {\n  background: #4d4d4d;\n}\n\n.theme-media .input-range-range {\n  background: #000;\n}\n\n.theme-media .input-range-handle {\n  background: #333333;\n}\n\n.theme-media .input-range-handle:active {\n  background: #4d4d4d;\n}\n\n.theme-media .tabs {\n  border-top-color: #4d4d4d;\n}\n\n.theme-media .dialogue-container {\n  background: rgba(51,51,51,0.85);\n}\n\n.theme-media .dialogue {\n  color: #858585;\n}\n\ngaia-header {\n  display: block;\n}\n\n/**\n * [hidden]\n */\n\ngaia-header[hidden] {\n  display: none;\n}\n\n/** Reset\n ---------------------------------------------------------*/\n\n::-moz-focus-inner {\n  border: 0;\n}\n\n/** Inner\n ---------------------------------------------------------*/\n\n.inner {\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  min-height: 50px;\n  background: #fff\n    #fff);\n}\n\n/** Action Button\n ---------------------------------------------------------*/\n\n/**\n * 1. Hidden by default\n */\n\n.action-button {\n  display: none;\n  /* 1 */\n  position: relative;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  width: 50px;\n  font-size: 30px;\n  border: none;\n  color: #333333\n    inherit);\n}\n\n/**\n * .action-supported\n *\n * 1. For icon vertical-alignment\n */\n\n.supported-action .action-button {\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  /* 1 */\n}\n\n/** Action Button Icon\n ---------------------------------------------------------*/\n\n/**\n * 1. To enable vertical alignment.\n */\n\n.action-button:before {\n  display: block;\n}\n\n/** Action Button Text\n ---------------------------------------------------------*/\n\n/**\n * To provide custom localized content for\n * the action-button, we allow the user\n * to provide an element with the class\n * .l10n-action. This node is then\n * pulled inside the real action-button.\n *\n * Example:\n *\n *   <gaia-header action="back">\n *     <span class="l10n-action" aria-label="Back">Localized text</span>\n *     <h1>title</h1>\n *   </gaia-header>\n */\n\n.-content .l10n-action {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  font-size: 0;\n}\n\n/** Title\n ---------------------------------------------------------*/\n\n/**\n * 1. Vertically center text. We can\'t use flexbox\n *    here as it breaks text-overflow ellipsis\n *    without an inner div.\n */\n\n.-content h1 {\n  -webkit-flex: 1;\n  -ms-flex: 1;\n  flex: 1;\n  margin: 0;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  text-align: center;\n  line-height: 50px;\n  /* 1 */\n  font-weight: 300;\n  font-style: italic;\n  font-size: 24px;\n  color: #333333\n    inherit);\n}\n\n/**\n * .flush-left\n *\n * When the fitted text is flush with the\n * edge of the left edge of the container\n * we pad it in a bit.\n */\n\n.-content h1.flush-left {\n  padding-left: 10px;\n}\n\n/**\n * .flush-right\n *\n * When the fitted text is flush with the\n * edge of the right edge of the container\n * we pad it in a bit.\n */\n\n.-content h1.flush-right {\n  padding-right: 10px;\n  /* 1 */\n}\n\n/** Buttons\n ---------------------------------------------------------*/\n\na,\nbutton,\n.-content a,\n.-content button {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  border: none;\n  width: auto;\n  height: auto;\n  margin: 0;\n  padding: 0 10px;\n  font-size: 14px;\n  line-height: 1;\n  min-width: 50px;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  -webkit-justify-content: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  text-decoration: none;\n  text-align: center;\n  background: none;\n  border-radius: 0;\n  font-style: italic;\n  -webkit-transition: all 0.2s;\n  transition: all 0.2s;\n  color: #333333\n    inherit);\n}\n\n/**\n * .active\n *\n * Turn off transiton-delay so the\n * active state shows instantly.\n *\n * Only apply the :active state when the\n * component indicates an interaction is\n * taking place.\n */\n\na.active,\nbutton.active,\n.-content a.active,\n.-content button.active {\n  opacity: 0.2;\n  -webkit-transition: none;\n  transition: none;\n}\n\n/**\n * [hidden]\n */\n\n.-content a[hidden],\n.-content button[hidden] {\n  display: none;\n}\n\n/**\n * [disabled]\n */\n\n.-content a[disabled],\n.-content button[disabled] {\n  pointer-events: none;\n  opacity: 0.5;\n}\n\n/** Icon Buttons\n ---------------------------------------------------------*/\n\n/**\n * Icons are a different color to text\n */\n\n.-content .icon,\n.-content [data-icon] {\n  color: #333333\n    inherit);\n}\n\n/** Icons\n ---------------------------------------------------------*/\n\n[class^="icon-"]:before,\n[class*="icon-"]:before {\n  font-family: \'gaia-icons\';\n  font-style: normal;\n  text-rendering: optimizeLegibility;\n  font-weight: 500;\n}\n\n.icon-back:before {\n  content: \'back\';\n}\n\n.icon-menu:before {\n  content: \'menu\';\n}\n\n.icon-close:before {\n  content: \'close\';\n}</style>\n\n<div class="inner">\n  <button class="action-button">\n    <content select=".l10n-action"></content>\n  </button>\n  <content select="h1,h2,h3,h4,a,button"></content>\n</div>';
        var stickyActive = function () {
            var noop = function () {
            };
            var pointer = [
                {
                    down: 'touchstart',
                    up: 'touchend'
                },
                {
                    down: 'mousedown',
                    up: 'mouseup'
                }
            ]['ontouchstart' in window ? 0 : 1];
            function exports(el, options) {
                options = options || {};
                var on = options.on || noop;
                var off = options.off || noop;
                var lag = options.ms || 300;
                var timeout;
                el.addEventListener(pointer.down, function (e) {
                    var target = e.target;
                    clearTimeout(timeout);
                    target.classList.add(exports.class);
                    on();
                    el.addEventListener(pointer.up, function fn(e) {
                        el.removeEventListener(pointer.up, fn);
                        timeout = setTimeout(function () {
                            target.classList.remove(exports.class);
                            off();
                        }, lag);
                    });
                });
            }
            exports.class = 'active';
            return exports;
        }();
        loadGaiaIcons(baseComponents);
        module.exports = document.registerElement('gaia-header', { prototype: proto });
        module.exports._prototype = proto;
    });
}(function (n, w) {
    'use strict';
    return typeof define == 'function' && define.amd ? define : typeof module == 'object' ? function (c) {
        c(require, exports, module);
    } : function (c) {
        var m = { exports: {} }, r = function (n) {
                return w[n];
            };
        w[n] = c(r, m.exports, m) || m.exports;
    };
}('gaia-header', this)));