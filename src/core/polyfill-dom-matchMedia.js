/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
window.matchMedia = window.matchMedia || (((doc, undefined) => {

  "use strict"; var element;
  return q => {

    if(!element) {
        var head = doc.head || doc.documentElement.firstElementChild || doc.getElementsByTagName('head')[0],
        element = doc.createElement( "style" );
        element.id = "css-mq-test";
        element.innerHTML = "#css-mq-test { font-size:666px; }>";
        head.insertBefore(element,head.firstChild);
    }
    
    element.setAttribute('media', q);
    var result = ((getComputedStyle ? getComputedStyle(element) : element.currentStyle).fontSize) === '666px';

    return {
      matches: result,
      media: q
    };

  };

})( document ));

/*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. Dual MIT/BSD license */
((() => {
	// monkeypatch unsupported addListener/removeListener with polling
	if( !window.matchMedia( "all" ).addListener ){
		
		var wMM = window.matchMedia;
		var oldMM = q => wMM.call(window,q)
		
		window.matchMedia = q => {
			var ret = oldMM( q ),
				listeners = [],
				last = ret.matches,
				timer,
				check = () => {
					var list = oldMM( q );
                    
					if( last != list.matches ){
						last = list.matches;
						for( var i =0, il = listeners.length; i< il; i++ ){
							try { listeners[ i ].call( ret, list ); }
							catch(ex) { setTimeout(() => { throw ex; },0) }
						}
					}
                    
				};
			
			ret.addListener = cb => {
				if( listeners.indexOf(cb) == -1 ) {
					listeners.push( cb );
				}
				if( !timer ){
					timer = setInterval( check, 250 );
				}
			};

			ret.removeListener = cb => {
				for( var i =0, il = listeners.length; i< il; i++ ){
					if( listeners[ i ] === cb ){
						listeners.splice( i, 1 ); break;
					}
				}
				if( !listeners.length && timer ){
					clearInterval( timer ); timer=undefined;
				}
			};
			
			return ret;
		};
	}
})());