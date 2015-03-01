/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */
!function(n){"use strict";function e(n){return new RegExp("(^|\\s+)"+n+"(\\s+|$)")}function s(n,e){var s=t(n,e)?a:i;s(n,e)}var t,i,a;"classList"in document.documentElement?(t=function(n,e){return n.classList.contains(e)},i=function(n,e){n.classList.add(e)},a=function(n,e){n.classList.remove(e)}):(t=function(n,s){return e(s).test(n.className)},i=function(n,e){t(n,e)||(n.className=n.className+" "+e)},a=function(n,s){n.className=n.className.replace(e(s)," ")});var o={hasClass:t,addClass:i,removeClass:a,toggleClass:s,has:t,add:i,remove:a,toggle:s};"function"==typeof define&&define.amd?define(o):n.classie=o}(window),function(){function n(){if(classie.has(s,"open")){classie.remove(s,"open"),classie.add(s,"close");var n=function(e){if(support.transitions){if("visibility"!==e.propertyName)return;this.removeEventListener(transEndEventName,n)}classie.remove(s,"close")};support.transitions?s.addEventListener(transEndEventName,n):n()}else classie.has(s,"close")||classie.add(s,"open")}var e=document.getElementById("trigger-overlay"),s=document.querySelector("div.overlay"),t=s.querySelector("button.overlay-close");transEndEventNames={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},transEndEventName=transEndEventNames[Modernizr.prefixed("transition")],support={transitions:Modernizr.csstransitions},e.addEventListener("click",n),t.addEventListener("click",n)}();