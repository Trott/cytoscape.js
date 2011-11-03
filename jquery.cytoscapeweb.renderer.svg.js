(function($){
	
	$.fn.svgattr = function(attrName, val){
		
		var container = $(this).parents("svg:first").parent();
		var svg = container.svg('get'); 
		
		if( val !== undefined ){
			// set
			var obj = {};
			obj[attrName] = val;
			svg.change( $(this)[0], obj );
		}
		
	};
	
})(jQuery);

$(function(){
	
	// TODO add more styles
	var defaults = {
		nodes: {
			fillColor: "#888",
			fillOpacity: 1,
			borderColor: "#666",
			borderOpacity: 1,
			borderWidth: 0,
			borderStyle: "solid",
			height: 10,
			width: 10,
			shape: "ellipse",
			cursor: "pointer",
			visibility: "visible",
			labelValign: "middle",
			labelHalign: "middle",
			labelText: "",
			labelFillColor: "#000",
			labelOutlineColor: "#666",
			labelOutlineWidth: 0,
			labelFontSize: "inherit",
			labelFontStyle: "normal",
			labelFontDecoration: "none", 
			labelFontVariant: "italic", 
			labelFontFamily: "Arial",
			labelFontWeight: "bold",
			labelOutlineOpacity: 1,
			labelFillOpacity: 1,
			selected: {
				fillColor: "#222",
				borderColor: "#000"
			}
		},
		edges: {
			lineColor: "#ccc",
			targetArrowColor: "#ccc",
			sourceArrowColor: "#ccc",
			targetArrowShape: "none",
			sourceArrowShape: "none",
			opacity: 1,
			width: 1,
			style: "solid",
			cursor: "pointer",
			visibility: "visible",
			labelText: "",
			labelFillColor: "#000",
			labelOutlineColor: "#666",
			labelOutlineWidth: 0,
			labelFontSize: "inherit",
			labelFontStyle: "normal",
			labelFontDecoration: "none", 
			labelFontVariant: "italic", 
			labelFontFamily: "Arial",
			labelFontWeight: "bold",
			labelOutlineOpacity: 1,
			labelFillOpacity: 1,
			selected: {
				lineColor: "#666",
				targetArrowColor: "#666",
				sourceArrowColor: "#666"
			}
		},
		global: {
			panCursor: "grabbing",
			selectionFillColor: "#ccc",
			selectionOpacity: 0.5,
			selectionBorderColor: "#888",
			selectionBorderWidth: 1
		}
	};
	
	var lineStyles = {};
	
	var registerLineStyle = function(style){
		$.cytoscapeweb("renderer", "svg", "linestyle", style.name, style);
		delete style.name;
	};
	
	registerLineStyle({
		name: "solid",
		array: undefined
	});
	
	registerLineStyle({
		name: "dot",
		array: [1, 5]
	});
	
	registerLineStyle({
		name: "longdash",
		array: [10, 2]
	});
	
	registerLineStyle({
		name: "dash",
		array: [5, 5]
	});
	
	var registerEdgeArrowShape = function(shape){
		$.cytoscapeweb("renderer", "svg", "edgearrowshape", shape.name, shape);
		delete shape.name;
	};
	
	registerEdgeArrowShape({
		name: "triangle",
		
		// generate the shape svg
		// the top points towards the node
		svg: function(svg, parent, edge, position, style){
			return svg.polygon(parent, [[0, 1], [0.5, 0], [1, 1]]);
		},
		
		// the point within the 1x1 box to line up with the center point at the
		// end of the edge
		centerPoint: {
			x: 0.5,
			y: 0.5
		}
	});
	
	registerEdgeArrowShape({
		name: "square",
		
		// generate the shape svg
		svg: function(svg, parent, edge, position, style){
			return svg.polygon(parent, [[0, 0], [0, 1], [1, 1], [1, 0]]);
		},
		
		centerPoint: {
			x: 0.5,
			y: 0.5
		}
	});
	
	registerEdgeArrowShape({
		name: "circle",
		
		// generate the shape svg
		svg: function(svg, parent, edge, position, style){
			return svg.circle(parent, 0.5, 0.5, 0.5);
		},
		
		centerPoint: {
			x: 0.5,
			y: 0.5
		}
	});
	
	var registerNodeShape = function(shape){
		$.cytoscapeweb("renderer", "svg", "nodeshape", shape.name, shape);
		delete shape.name;
	};
	
	// use this as an example for adding more node shapes
	registerNodeShape({
		// name of the shape
		name: "ellipse",
		
		// generate the shape svg
		svg: function(svg, parent, node, position, style){
			return svg.ellipse(parent, position.x, position.y, style.width, style.height);
		},
		
		// update unique style attributes for this shape
		// see http://keith-wood.name/svgRef.html for api reference
		update: function(svg, parent, node, position, style){
			svg.change(node._private.svg, {
				cx: position.x,
				cy: position.y,
				rx: style.width / 2,
				ry: style.height / 2
			});
		},
		
		// 2D shape in intersection lib
		intersectionShape: Ellipse
	});
	
	registerNodeShape({
		name: "rectangle",
		svg: function(svg, parent, node, position, style){
			return svg.rect(parent, position.x - style.width/2, position.y - style.height/2, style.width, style.height);
		},
		update: function(svg, parent, node, position, style){
			svg.change(node._private.svg, {
				x: position.x - style.width/2,
				y: position.y - style.height/2,
				width: style.width,
				height: style.height
			});
		},
		
		intersectionShape: Rectangle
	});
	
	registerNodeShape({
		name: "roundrectangle",
		svg: function(svg, parent, node, position, style){
			return svg.rect(parent, position.x - style.width/2, position.y - style.height/2, style.width, style.height, style.width/4, style.height/4);
		},
		update: function(svg, parent, node, position, style){
			svg.change(node._private.svg, {
				x: position.x - style.width/2,
				y: position.y - style.height/2,
				width: style.width,
				height: style.height
			});
		},
		
		intersectionShape: Rectangle
	});
	
	registerNodeShape({
		name: "triangle",
		svg: function(svg, parent, node, position, style){
			return svg.polygon(parent,
					           [ 
					             [position.x,                 position.y - style.height/2], 
					             [position.x + style.width/2, position.y + style.height/2],
					             [position.x - style.width/2, position.y + style.height/2]
					           ]);
		},
		update: function(svg, parent, node, position, style){
			svg.change(node._private.svg, {
				points: [ 
			             [position.x,                 position.y - style.height/2], 
			             [position.x + style.width/2, position.y + style.height/2],
			             [position.x - style.width/2, position.y + style.height/2]
			           ]
			});
		},
		
		intersectionShape: Polygon
	});
	
	function visibility(v){
		if( v != null && typeof v == typeof "" && ( v == "hidden" || v == "visible" ) ){
			return v;
		} else {
			$.cytoscapeweb("error", "SVG renderer does not recognise %o as a valid visibility", v);
		}
	};
	
	function percent(p){
		if( p != null && typeof p == typeof 1 && !isNaN(p) &&  0 <= p && p <= 1 ){
			return p;
		} else {
			$.cytoscapeweb("error", "SVG renderer does not recognise %o as a valid percent (should be between 0 and 1)", p);
		}
	}
	
	function color(c){
		if( c != null && typeof c == typeof "" && $.Color(c) != "" ){
			return $.Color(c).toHEX();
		} else {
			$.cytoscapeweb("error", "SVG renderer does not recognise %o as a valid colour", c);
		}
	}
	
	function number(n){
		if( n != null && typeof n == typeof 1 && !isNaN(n) ){
			return n;
		} else {
			$.cytoscapeweb("error", "SVG renderer does not recognise %o as a valid number", n);
		}
	}
	
	function nodeShape(name){
		var ret = $.cytoscapeweb("renderer", "svg", "nodeshape", name);
		
		if( ret == null ){
			$.cytoscapeweb("error", "SVG renderer does not recognise %s as a valid node shape", name);
		}
		
		return ret;
	}
	
	function lineStyle(name){
		var ret = $.cytoscapeweb("renderer", "svg", "linestyle", name);
		
		if( ret == null ){
			$.cytoscapeweb("error", "SVG renderer does not recognise %s as a valid line style", name);
		}
		
		return ret;
	}
	
	function edgeArrowShape(name){
		if( name == "none" || name == null ){
			return null;
		}
		
		return $.cytoscapeweb("renderer", "svg", "edgearrowshape", name);
	}
	
	function labelHalign(a){
		if( a != null && typeof a == typeof "" && ( a == "left" || a == "right" || a == "middle" ) ){
			return a;
		} else {
			$.cytoscapeweb("error", "SVG renderer does not recognise %o as a valid label horizonal alignment", a);
		}	
	}
	
	function labelValign(a){
		if( a != null && typeof a == typeof "" && ( a == "top" || a == "bottom" || a == "middle" ) ){
			return a;
		} else {
			$.cytoscapeweb("error", "SVG renderer does not recognise %o as a valid label vertical alignment", a);
		}	
	}
	
	function cursor(name){
		if( name == "grab" ){
			if( $.browser.webkit ){
				return "-webkit-grab";
			} else if( $.browser.mozilla ){
				return "-moz-grab";
			} else {
				return "move";
			}
		} else if( name == "grabbing" ){
			if( $.browser.webkit ){
				return "-webkit-grabbing";
			} else if( $.browser.mozilla ){
				return "-moz-grabbing";
			} else {
				return "move";
			}
		} else {
			return name;
		}
	}
	
	function SvgRenderer(options){
		$.cytoscapeweb("debug", "Creating SVG renderer with options (%o)", options);
		this.options = options;
		this.style = $.extend(true, {}, defaults, options.style);
		
		$.cytoscapeweb("debug", "SVG renderer is using style (%o)", this.style);
	}
	
	SvgRenderer.prototype.init = function(callback){
		var container = $(this.options.selector);
		var svg = container.svg('get'); 
		var self = this;
		
		this.container = container;
		this.svg = svg;
		this.cy = this.options.cytoscapeweb;
		
		if( svg != null ){
			svg.clear(true);	
		} else {
			container.css({
				padding: "0 !important"
			});
			
			container.svg({
				onLoad: function(s){
					
					self.scale = 1;
					self.translation = { x: 0, y: 0 };
					
					container.find("svg").css("overflow", "hidden"); // fixes ie overflow
					
					self.transformTouchEvent(window, "touchmove", "mousemove");
					
					svg = s;
					self.svg = svg;
					
					self.edgesGroup = svg.group();
					self.nodesGroup = svg.group();
					self.svgRoot = $(self.nodesGroup).parents("svg:first")[0];
					
					self.selectedElements = self.cy.collection();
					
					$(self.edgesGroup).svgattr("class", "cw-edges");
					$(self.nodesGroup).svgattr("class", "cw-nodes");
					
					self.defs = self.svg.defs();
					
					self.makeBackgroundInteractive();
					
					callback();
				}
			});
		}
	};
	
	SvgRenderer.prototype.offsetFix = function(e){
		var self = this;
		
		// firefox fix :(
		if( e.offsetX == null || e.offsetY == null ){
			e.offsetX = e.clientX - $(self.options.selector).offset().left;
			e.offsetY = e.clientY - $(self.options.selector).offset().top;
		}
	};
	
	SvgRenderer.prototype.makeBackgroundInteractive = function(){
		
		var self = this;
		
		var svgDomElement = self.svgRoot;
		var panDelay = 150;
		
		self.shiftDown = false;
		$(window).bind("keydown keyup", function(e){
			self.shiftDown = e.shiftKey;
		});
		
		$(svgDomElement).bind("mousedown", function(mousedownEvent){

			// ignore right clicks
			if( mousedownEvent.button != 0 ){
				return;
			}
			
			if( mousedownEvent.target == svgDomElement || $(mousedownEvent.target).parents("g:last")[0] == self.edgesGroup ){
				mousedownEvent.preventDefault();
				
				self.offsetFix(mousedownEvent);
				
				var selectionSquare = null;
				var selectionBounds = {};
				
				var panning = false;
				var selecting = true;
				
				var originX = mousedownEvent.pageX;
				var originY = mousedownEvent.pageY;
				
				var selectOriginX = mousedownEvent.offsetX;
				var selectOriginY = mousedownEvent.offsetY;
				var selectDx = 0;
				var selectDy = 0;
				
				var panDelayTimeout = setTimeout(function(){
					panning = true;
					selecting = false;
					
					self.svg.change(svgDomElement, {
						cursor: cursor(self.style.global.panCursor)
					});
					
					$(self.options.selector).scrollLeft(100);
					
				}, panDelay);
				
				var dragHandler = function(dragEvent){
					clearTimeout(panDelayTimeout);
					
					var dx = dragEvent.pageX - originX;
					var dy = dragEvent.pageY - originY;
					
					// new origin each event
					originX = dragEvent.pageX;
					originY = dragEvent.pageY;
					
					selectDx += dx;
					selectDy += dy;
					
					if( panning ){	
						self.translation.x += dx;
						self.translation.y += dy;
						
						self.pan(self.translation);
					}
					
					if( selecting ){
						if( selectionSquare == null ){
							selectionSquare = self.svg.rect(selectOriginX, selectOriginY, 0, 0, {
								fill: color(self.style.global.selectionFillColor),
								opacity: percent(self.style.global.selectionOpacity),
								stroke: color(self.style.global.selectionBorderColor),
								strokeWidth: number(self.style.global.selectionBorderWidth)
							});
						} else {
							
							var width = Math.abs(selectDx);
							var height = Math.abs(selectDy);
							var x = selectDx >= 0 ? selectOriginX : selectOriginX + selectDx;
							var y = selectDy >= 0 ? selectOriginY : selectOriginY + selectDy;
							
							selectionBounds = {
								x1: x,
								y1: y,
								x2: x + width,
								y2: y + height
							};
							
							self.svg.change(selectionSquare, {
								x: x,
								y: y,
								width: width,
								height: height
							});
						}
					}
				};
				
				$(window).bind("mousemove", dragHandler);
				
				var endHandler = function(mouseupEvent){
					
					// ignore right clicks
					if( mouseupEvent.type == "mouseup" && mouseupEvent.button != 0 ){
						return;
					}
					
					clearTimeout(panDelayTimeout);
					
					$(window).unbind("mousemove", dragHandler);
	
					$(window).unbind("mouseup", endHandler);
					$(window).unbind("blur", endHandler);
					$(svgDomElement).unbind("mouseup", endHandler);
					
					if( panning ){
						self.svg.change(svgDomElement, {
							cursor: null
						});
					}
					
					if( selecting ){
						if( selectionSquare != null && selectionBounds.x1 != null && !isNaN(selectionBounds.x1) ){
							self.selectElementsFromIntersection(selectionSquare, selectionBounds);
							self.svg.remove(selectionSquare);
						} else if( mouseupEvent.target == svgDomElement ){
							self.unselectAll();
						}
					}
					
				};
				
				$(window).bind("mouseup", endHandler);
				$(window).bind("blur", endHandler);
				$(svgDomElement).bind("mouseup", endHandler);
			}
		}).bind("mousewheel", function(e, delta, deltaX, deltaY){
			
			self.offsetFix(e);
			
			var point = {
				x: e.offsetX,
				y: e.offsetY
			};
			
			var pan1 = self.pan();
			var zoom1 = self.zoom();
			var zoom2 = zoom1 * (1 + delta);
			
			var pan2 = {
				x: -zoom2/zoom1 * (point.x - pan1.x) + point.x,
				y: -zoom2/zoom1 * (point.y - pan1.y) + point.y
			};
			
			self.transform({
				translation: pan2,
				scale: zoom2
			});	
			
			e.preventDefault();
		});
		
		$(svgDomElement).bind("mousedown mouseup click mouseover mouseout", function(e){
			var event = $.extend({}, e, { cyTarget: self.cy });
			
			self.cy.background().trigger(event);
			
			if( e.type == "mouseover" && e.target != svgDomElement ){
				return;
			}
			
			if( e.type == "mouseout" ){
				var parents = $(e.toElement).parents();
				
				if( e.toElement == svgDomElement ){
					return;
				}
				
				for(var i = 0; i < parents.size(); i++){
					var parent = parents.eq(i);
					if( parent[0] == svgDomElement ){
						return;
					}
				}
			}
			
			self.cy.trigger(event);
		});
		
	};
	
	SvgRenderer.prototype.zoom = function(scale){
		
		if( scale === undefined ){
			return this.scale;
		}
		
		this.transform({
			scale: scale
		});
	};
	
	SvgRenderer.prototype.fit = function(params){
		var elements = params.elements;
		var zoom = params.zoom;
		
		if( elements == null || elements.size() == 0 ){
			elements = this.cy.elements();
		}
		
		if( elements.is(":removed") ){
			$.cytoscapeweb("debug", "SVG renderer does not take into account removed elements when fitting");
			elements = elements.filter(":inside");
		}
		
		$.cytoscapeweb("debug", "Fit SVG renderer to view bounds");
		
		var n = this.nodesGroup.getBBox();
		var e = this.edgesGroup.getBBox();
		
		var x1, y1, x2, y2;
		
		function update(bb){
			var left = bb.x;
			var right = left + bb.width;
			var top = bb.y;
			var bottom = top + bb.height;
			
			if( left < x1 || x1 == null ){
				x1 = left;
			}
			
			if( right > x2 || x2 == null ){
				x2 = right;
			}
			
			if( top < y1 || y1 == null ){
				y1 = top;
			}
			
			if( bottom > y2 || y2 == null ){
				y2 = bottom;
			}
		}
		
		elements.nodes().each(function(){
			var bb = this._private.svgGroup.getBBox();
			update(bb);
		});
		
		// fix for loop edges (their bounding boxes are 2x width and height of path
		// they push the bb up and left
		elements.edges().each(function(){
			var src = this._private.data.source;
			var tgt = this._private.data.target;
			var bb = this._private.svg.getBBox();
			
			if( src == tgt ){
			
				if( bb.x == e.x ){
					x1 = Math.min(bb.x + bb.width*0.4, n.x);
				}
				
				if( bb.y == e.y ){
					y1 = Math.min(bb.y + bb.height*0.4, n.y);
				}
				
				// TODO check edge labels when added
			} else {
				bb = this._private.svgGroup.getBBox();
				update(bb);
			}
		});
		
		var w = x2 - x1;
		var h = y2 - y1;
		
		var width = this.container.width();
		var height = this.container.height();
		
		var scale = Math.min( width/w, height/h );
		
		if( zoom ){
			this.transform({
				translation: {
					x: -x1 * scale - (w*scale - width)/2,
					y: -y1 * scale - (h*scale - height)/2
				},
				scale: scale
			});
		} else {
			var z = this.scale;
			
			this.transform({
				translation: {
					x: -x1*z + width/2 - (x2-x1)/2*z,
					y: -y1*z + height/2 - (y2-y1)/2*z
				}
			});
		}
		
	};
	
	SvgRenderer.prototype.panBy = function(position){
		$.cytoscapeweb("debug", "Relatively pan SVG renderer with position (%o)", position);
		
		this.transform({
			translation: {
				x: this.translation.x + number(position.x),
				y: this.translation.y + number(position.y)
			}
		});
	};
	
	SvgRenderer.prototype.pan = function(position){
		$.cytoscapeweb("debug", "Pan SVG renderer with position (%o)", position);
		
		if( position === undefined ){
			return {
				x: this.translation.x,
				y: this.translation.y
			};
		}
		
		if( position == null || typeof position != typeof {} ){
			$.cytoscapeweb("error", "You can not pan without specifying a proper position object; `%o` is invalid", position);
			return;
		}
		
		this.transform({
			translation: {
				x: number(position.x),
				y: number(position.y)
			}
		});
	};
	
	SvgRenderer.prototype.transform = function(params){
		var translation = params.translation;
		var scale = params.scale;
		var self = this;
		
		if( translation != null ){
			self.translation = {
				x: translation.x,
				y: translation.y
			};
		}
		
		if( scale != null ){
			self.scale = scale;
		}
		
		function transform(svgElement){
			self.svg.change(svgElement, {
				transform: "translate(" + self.translation.x + "," + self.translation.y + ") scale(" + self.scale + ")"
			});
		}
		
		transform(self.nodesGroup);
		transform(self.edgesGroup);
	};
	
	SvgRenderer.prototype.calculateStyleField = function(element, fieldName){
		var self = this;
		var styleCalculator = self.options.styleCalculator;
		
		var field = this.style[element.group()][fieldName];
		var bypassField = element._private.bypass[fieldName];
		var selectedField = this.style[element.group()].selected != null ? this.style[element.group()].selected[fieldName] : undefined;
		
		if( bypassField !== undefined ){
			field = bypassField;
		}
		
		if( element.selected() && selectedField !== undefined ){
			field = selectedField;
		}
		
		return styleCalculator.calculate(element, field);
	};
	
	SvgRenderer.prototype.calculateStyle = function(element){
		var self = this;
		var styleCalculator = self.options.styleCalculator;
		var style = $.extend({}, this.style[element.group()], element._private.bypass);
		
		if( element.selected() ){
			var selected = style.selected;
			delete style.selected;
			
			style = $.extend({}, style, selected);
		} else {
			delete style.selected;
		}
		
		$.each(style, function(styleName, styleVal){
			style[styleName] = styleCalculator.calculate(element, styleVal);
		});
		
		element._private.style = style;
		
		if( element._private.group == "nodes" ){
		
		} if( element._private.group == "edges" ){
			var source = element.source();
			var target = element.target();
			
			function calculateVisibility(){
				if( source._private.style.visibility == "visible" && target._private.style.visibility == "visible" ){
					return visibility(style.visibility);
				} else {
					return "hidden";
				}
			}
			
			style.visibility = calculateVisibility();
		}
		
		return style;
	};
	
	SvgRenderer.prototype.updateNodePositionFromShape = function(element){
		var style = element._private.style;
		var parent = element._private.svgGroup;
		var position = element._private.position;
		
		nodeShape(style.shape).update(this.svg, parent, element, position, style);
	};
	
	SvgRenderer.prototype.transformTouchEvent = function(domElement, fromEvent, toEvent){
		domElement.addEventListener(fromEvent, function(e){
			var evt = $.extend({}, e);
			evt.type = toEvent;
			
			if( e.touches != null && e.touches[0] != null ){
				evt.pageX = e.touches[0].pageX;
				evt.pageY = e.touches[0].pageY;
				evt.clientX = e.touches[0].clientX;
				evt.clientY = e.touches[0].clientY;
				evt.screenX = e.touches[0].screenX;
				evt.screenY = e.touches[0].screenY;
				evt.layerX = e.touches[0].layerX;
				evt.layerY = e.touches[0].layerY;
			}
			
			e.preventDefault();
			$(domElement).trigger(evt);
			return false;
		});
	};
	
	SvgRenderer.prototype.makeSvgEdgeInteractive = function(element){
		var svgDomElement = element._private.svg;
		var targetArrow = element._private.targetSvg;
		var sourceArrow = element._private.sourceSvg;
		var svgCanvas = $(svgDomElement).parents("svg:first")[0];
		var self = this;
		
		$(svgDomElement).add(targetArrow).add(sourceArrow).bind("mouseup mousedown click", function(e){
			element.trigger(e);
		}).bind("click", function(e){
			self.selectElement(element);
		});
	};
	
	SvgRenderer.prototype.makeSvgNodeLabelInteractive = function(element){
	};
	

	SvgRenderer.prototype.makeSvgNodeInteractive = function(element){
		var svgDomElement = element._private.svg;
		var svgCanvas = $(svgDomElement).parents("svg:first")[0];
		var self = this;
		var draggedAfterMouseDown = null;
		
		// you need to prevent default event handling to 
		// prevent built-in browser drag-and-drop etc
		
		$(svgDomElement).bind("mousedown", function(mousedownEvent){
			draggedAfterMouseDown = false;
			
			element.trigger(mousedownEvent);
			
			if( element._private.grabbed || element._private.locked ){
				mousedownEvent.preventDefault();
				return;
			}
			 
			element._private.grabbed = true;
			
			var originX = mousedownEvent.pageX;
			var originY = mousedownEvent.pageY;
			
			var justStartedDragging = true;
			var dragHandler = function(dragEvent){
				
				self.moveToFront(element);
				draggedAfterMouseDown = true;
				
				var dx = (dragEvent.pageX - originX) / self.zoom();
				var dy = (dragEvent.pageY - originY) / self.zoom();
				
				// new origin each event
				originX = dragEvent.pageX;
				originY = dragEvent.pageY;
				
				var elements;
				
				if( element.selected() ){
					elements = self.selectedElements.add(element);
				} else {
					elements = element.collection();
				}
				
				elements.each(function(i, e){
					e._private.position.x += dx;
					e._private.position.y += dy;
				});			
				
				self.updatePosition( elements );
				
				if( justStartedDragging ){
					justStartedDragging = false;
					element.trigger($.extend({}, dragEvent, { type: "dragstart" }));
				} else {
					element.trigger($.extend({}, dragEvent, { type: "drag" }));
				}
				
			};
			
			$(window).bind("mousemove", dragHandler);
			
			var finishedDragging = false;
			var endHandler = function(mouseupEvent){
				
				if( !finishedDragging ){
					finishedDragging = true;
				} else {
					return;
				}
				
				$(window).unbind("mousemove", dragHandler);

				$(window).unbind("mouseup", endHandler);
				$(window).unbind("blur", endHandler);
				$(svgDomElement).unbind("mouseup", endHandler);
				
				element._private.grabbed = false;
				
				element.trigger($.extend({}, mouseupEvent, { type: "dragstop" }));
			};
			
			$(window).bind("mouseup", endHandler);
			$(window).bind("blur", endHandler);
			$(svgDomElement).bind("mouseup", endHandler);
			
			mousedownEvent.preventDefault();
		}).bind("mouseup", function(e){
			element.trigger($.extend({}, e));
			
			if( draggedAfterMouseDown == false ){
				draggedAfterMouseDown = null;
				element.trigger($.extend({}, e, { type: "click" }));
				self.selectElement(element);
			}
		}).bind("mouseover mouseout mousemove", function(e){
			element.trigger($.extend({}, e));
		});
		
	};
	
	SvgRenderer.prototype.modelPoint = function(screenPoint){
		var self = this;
		return {
			x: (screenPoint.x - self.pan().x) / self.zoom(),
			y: (screenPoint.y - self.pan().y) / self.zoom()
		};
	}
	
	SvgRenderer.prototype.renderedPoint = function(modelPoint){
		var self = this;
		return {
			x: modelPoint.x * self.zoom() + self.pan().x,
			y: modelPoint.y * self.zoom() + self.pan().y
		};
	}
	
	SvgRenderer.prototype.renderedPosition = function(element){
		var self = this;
		
		return self.renderedPoint(element._private.position);
	};
	
	SvgRenderer.prototype.hideElements = function(collection){
		collection.each(function(i, element){
			element._private.bypass.visibility = "hidden";
		});
		
		this.updateBypass(collection);
	};
	
	SvgRenderer.prototype.showElements = function(collection){
		collection.each(function(i, element){
			element._private.bypass.visibility = "visible";
		});
		
		this.updateBypass(collection);
	};
	
	SvgRenderer.prototype.elementIsVisible = function(element){
		return element._private.bypass.visibility != "hidden";
	};
	
	SvgRenderer.prototype.renderedDimensions = function(element){
		var self = this;
		
		if( element.isNode() ){
			return {
				height: element._private.style.height * self.zoom(),
				width: element._private.style.width * self.zoom(),
				size: element._private.style.size * self.zoom()
			};
		} else {
			return {
				width: element._private.style.width * self.zoom()
			};
		}
	};
	
	SvgRenderer.prototype.unselectElements = function(collection){
		collection = collection.collection();
		
		collection.unselect();
		this.selectedElements = this.selectedElements.not(collection);
	};
	
	// by drag select
	SvgRenderer.prototype.selectElementsFromIntersection = function(svgSelectionShape, selectionBounds){
		var self = this;
		var toSelect = this.cy.collection();
		var toUnselect = this.cy.collection();
		
		function nodeInside(element){

			// intersect rectangle in the model with the actual node shape in the model
			var shape = nodeShape(element._private.style.shape).intersectionShape;
			var modelRectangleP1 = self.modelPoint({ x: selectionBounds.x1, y: selectionBounds.y1 });
			var modelRectangleP2 = self.modelPoint({ x: selectionBounds.x2, y: selectionBounds.y2 });
			var modelRectangle = self.svg.rect(modelRectangleP1.x, modelRectangleP1.y, modelRectangleP2.x - modelRectangleP1.x, modelRectangleP2.y - modelRectangleP1.y);
			var intersection = Intersection.intersectShapes(new Rectangle(modelRectangle), new shape(element._private.svg));
			self.svg.remove(modelRectangle);
			
			// rendered node
			var zoom = self.zoom();
			var x = element.renderedPosition().x;
			var y = element.renderedPosition().y;
			var w = element.renderedDimensions().width + element._private.style.borderWidth * zoom;
			var h = element.renderedDimensions().height + element._private.style.borderWidth * zoom;
			
			// rendered selection square
			var x1 = selectionBounds.x1;
			var y1 = selectionBounds.y1;
			var x2 = selectionBounds.x2;
			var y2 = selectionBounds.y2;
			
			var centerPointInside = x1 <= x && x <= x2 && y1 <= y && y <= y2;
			var intersects = intersection.points.length > 0;
			
			return centerPointInside || intersects;
		}
		
		this.cy.elements().each(function(i, element){
			if( element.isNode() ){
				if( nodeInside(element) ){
					toSelect = toSelect.add(element);
				}
			} else {
				// if both node center points are inside, then the edge is inside
				if( nodeInside( element.source() ) &&
					nodeInside( element.target() ) ){
					
					toSelect = toSelect.add(element);
				}
				
			}
		});
		
		if( !self.shiftDown ){
			toUnselect = toUnselect.add(
				this.cy.elements().filter(function(i, e){
					return e.selected() && !toSelect.allSame(e);
				})
			);
		}
		
		toUnselect.unselect();
		toSelect.select();
		
		self.selectedElements = self.selectedElements.not(toUnselect);
		self.selectedElements = self.selectedElements.add(toSelect);
		self.moveToFront(toSelect);
		
	};
	
	// by clicking
	SvgRenderer.prototype.selectElement = function(element){
		var self = this;
		
		var toUnselect = self.cy.collection();
		var toSelect = self.cy.collection();
		
		if( !self.shiftDown ){
			toUnselect = toUnselect.add(
				self.cy.elements().filter(function(i, e){
					return e.selected() && !element.same(e);
				})
			);
		}
		
		if( self.shiftDown ){
			if( element.selected() ){
				toUnselect = toUnselect.add(element);
			} else {
				toSelect = toSelect.add(element);
			}
		} else if( !element.selected() ){
			toSelect = toSelect.add(element);
		}
		
		toUnselect.unselect();
		toSelect.select();
		
		self.selectedElements = self.selectedElements.not(toUnselect);
		self.selectedElements = self.selectedElements.add(toSelect);
		self.moveToFront(toSelect);
	};
	
	SvgRenderer.prototype.moveToFront = function(collection){
		collection = collection.collection();
		var self = this;
		
		collection.each(function(i, element){
			self.svg.remove(element._private.svgGroup);
			self.makeSvgElement(element);
			self.updatePosition(collection.closedNeighborhood().edges());
		});
	};
	
	SvgRenderer.prototype.unselectAll = function(){
		this.unselectElements(this.cy.elements());
	};
	
	SvgRenderer.prototype.makeSvgNode = function(element){		
		var p = element._private.position;
		var self = this;
		
		if( p.x == null || p.y == null ){
			$.cytoscapeweb("debug", "SVG renderer is ignoring creating of node `%s` with position (%o, %o)", element._private.data.id, p.x, p.y);
			return;
		}
		
		var svgDomElement;
		var style = this.calculateStyle(element);
		
		var svgDomGroup = this.svg.group(this.nodesGroup);
		element._private.svgGroup = svgDomGroup;
		
		svgDomElement = nodeShape(style.shape).svg(this.svg, svgDomGroup, element, p, style);
		this.makeSvgNodeLabel(element);
		
		this.transformTouchEvent(svgDomElement, "touchstart", "mousedown");
		this.transformTouchEvent(svgDomElement, "touchend", "mouseup");
		
		element._private.svg = svgDomElement;
		$.cytoscapeweb("debug", "SVG renderer made node `%s` with position (%i, %i)", element._private.data.id, p.x, p.y);
		
		this.makeSvgNodeInteractive(element);
		this.updateElementStyle(element, style);
		return svgDomElement;
	};
	
	SvgRenderer.prototype.makeSvgNodeLabel = function(element){
		var self = this;
		
		var x = element._private.position.x;
		var y = element._private.position.y;
		
		element._private.svgLabel = self.svg.text(element._private.svgGroup, x, y, "label init");
	};
	
	SvgRenderer.prototype.positionSvgNodeLabel = function(element){
		var self = this;

		self.svg.change(element._private.svgLabel, {
			x: element._private.position.x,
			y: element._private.position.y
		});
	};
	
	SvgRenderer.prototype.makeSvgEdgePath = function(element){
		var self = this;
		var tgt = element.target();
		var src = element.source();
		var loop = tgt._private.data.id == src._private.data.id;
		var svgPath;
		
		var x1 = src._private.position.x;
		var y1 = src._private.position.y;
		var x2 = tgt._private.position.x;
		var y2 = tgt._private.position.y;
		
		// if the nodes are directly on top of each other, just make a small difference
		// so we don't get bad calculation states (e.g. divide by zero)
		if( x1 == x2 && y1 == y2 ){
			x2++;
			y2++;
		}
		
		var parallelEdges = element.parallelEdges();
		var size = parallelEdges.size();
		var index;
		var curveIndex;
		var curveDistance = 20;
		var betweenLoopsDistance = 20;
		var cp, cp1, cp2;
		var pDistance = self.getDistance({ x: x1, y: y1 }, { x: x2, y: y2 });
		var maxCurveDistance = 200;
		
		if( !loop && curved ){
			curveDistance = Math.min(20 + 4000/pDistance, maxCurveDistance);
		}
	
		parallelEdges.each(function(i, e){
			if( e == element ){
				index = i;
			}
		});
		
		function makePath(){
			var curved = curveIndex != 0;
			var path = self.svg.createPath();
			
			if( svgPath != null ){
				self.svg.remove(svgPath);
			}
			
			if( loop ){
				svgPath = self.svg.path( element._private.svgGroup, path.move(x1, y1).curveC(cp1.x, cp1.y, cp2.x, cp2.y, x2, y2) );
			} else if( curved ){
				svgPath = self.svg.path( element._private.svgGroup, path.move(x1, y1).curveQ(cp.x, cp.y, x2, y2) );
			} else {
				svgPath = self.svg.path( element._private.svgGroup, path.move(x1, y1).line(x2, y2) );
			}
		}
		
		if( loop ){
			var sh = src._private.style.height;
			var sw = src._private.style.width;
			curveDistance += Math.max(sw, sh);
			
			curveIndex = index;
			curveDistance += betweenLoopsDistance * (curveIndex);
			
			var h = curveDistance;
	        cp1 = { x: x1, y: y1 - sh/2 - h };
	        cp2 = { x: x1 - sw/2 - h, y: y1 };
			
			makePath();
		} else {
			// edge between 2 nodes
			
			var even = size % 2 == 0;
			if( even ){
				// even
				curveIndex = index - size/2 + (index < size/2 ? 0 : 1); // add one if on positive size (skip 0)
				
				if( curveIndex > 0 ){
					curveIndex -= 0.5;
				} else {
					curveIndex += 0.5;
				}
			} else {
				// odd
				curveIndex = index - Math.floor(size/2);
			}
			
			var curved = curveIndex != 0;
			
			if( src._private.data.id > tgt._private.data.id ){
				curveIndex *= -1;
			}
			
			if(curved){
				cp = cp1 = cp2 = self.getOrthogonalPoint({ x: x1, y: y1 }, { x: x2, y: y2 }, curveDistance * curveIndex);
			} else {
				cp = cp1 = {
					x: x2,
					y: y2
				};
				
				cp2 = {
					x: x1,
					y: y1
				};
			}
			
			makePath();
		}
		
		var edgeWidth = self.calculateStyleField(element, "width");
		var targetShape = self.calculateStyleField(tgt, "shape");
		var sourceShape = self.calculateStyleField(src, "shape");
		var targetArrowShape = self.calculateStyleField(element, "targetArrowShape");
		var sourceArrowShape = self.calculateStyleField(element, "sourceArrowShape");
		var markerFactor = 3;
		var minArrowSize = 10;
		
		while(markerFactor * edgeWidth < minArrowSize){
			markerFactor++;
		}
		
		var f = markerFactor;
		var markerHeight = f * edgeWidth;
		var targetShape = nodeShape(targetShape).intersectionShape;
		var sourceShape = nodeShape(sourceShape).intersectionShape;
		
		var intersection = Intersection.intersectShapes(new Path(svgPath), new targetShape(tgt._private.svg));
		var tgtInt = intersection.points[ intersection.points.length - 1 ];
		
		intersection = Intersection.intersectShapes(new Path(svgPath), new sourceShape(src._private.svg));
		var srcInt = intersection.points[0];
		
		var scale = f * edgeWidth;
		var sourceRotation = -1*(this.getAngle(cp1, { x: x1, y: y1 }) - 90);
		var targetRotation = -1*(this.getAngle(cp2, { x: x2, y: y2 }) - 90);
		
		if( tgtInt != null ){
			if( targetArrowShape != "none" ){
				var end = self.getPointAlong(tgtInt, cp2, markerHeight/2, tgtInt);
				x2 = end.x;
				y2 = end.y;
			} else if( tgtInt != null ){
				x2 = tgtInt.x;
				y2 = tgtInt.y;
			}
		}
		
		if( srcInt != null ){
			if( sourceArrowShape != "none" ){
				var start = self.getPointAlong(srcInt, cp1, markerHeight/2, srcInt);
				x1 = start.x;
				y1 = start.y;
			} else {
				x1 = srcInt.x;
				y1 = srcInt.y;
			}
		}
		
		makePath();
		
		if( element._private.targetArrow != null ){
			this.svg.remove(element._private.targetArrow);
		}
		
		if( targetArrowShape != "none" ){
			var tgtShapeObj = edgeArrowShape(targetArrowShape);
			var tgtArrowTranslation = {
				x: x2 - tgtShapeObj.centerPoint.x * scale,
				y: y2 - tgtShapeObj.centerPoint.y * scale,
			};
			var targetCenter = tgtShapeObj.centerPoint;
			var targetArrow = tgtShapeObj == null ? null : tgtShapeObj.svg(this.svg, element._private.svgGroup, element, element._private.position, element._private.style);
			element._private.targetSvg = targetArrow;

			this.svg.change(targetArrow, {
				transform: "translate(" + tgtArrowTranslation.x + " " + tgtArrowTranslation.y + ") scale(" + scale + ") rotate(" + targetRotation + " " + targetCenter.x + " " + targetCenter.y + ")"
			});
		}
		
		if( sourceArrowShape != "none" ){
			if( element._private.sourceArrow != null ){
				this.svg.remove(element._private.sourceArrow);
			}
			
			var srcShapeObj = edgeArrowShape(sourceArrowShape);
			var srcArrowTranslation = {
				x: x1 - srcShapeObj.centerPoint.x * scale,
				y: y1 - srcShapeObj.centerPoint.y * scale,
			};
			var sourceCenter = srcShapeObj.centerPoint;
			var sourceArrow = srcShapeObj == null ? null : srcShapeObj.svg(this.svg, element._private.svgGroup, element, element._private.position, element._private.style);
			element._private.sourceSvg = sourceArrow;
			
			this.svg.change(sourceArrow, {
				transform: "translate(" + srcArrowTranslation.x + " " + srcArrowTranslation.y + ") scale(" + scale + ") rotate(" + sourceRotation + " " + sourceCenter.x + " " + sourceCenter.y + ")"
			});
		}
		
		var labelPosition;
		if( loop ){
			labelPosition = {
				x: (cp1.x + cp2.x)/2*0.85 + tgt._private.position.x*0.15,
				y: (cp1.y + cp2.y)/2*0.85 + tgt._private.position.y*0.15
			};
		} else if( curved ) {
			labelPosition = {
				x: ( cp.x + (x1+x2)/2 )/2,
				y: ( cp.y + (y1+y2)/2 )/2
			};
		} else {
			labelPosition = {
				x: (x1 + x2)/2,
				y: (y1 + y2)/2
			};
		}
		
		element._private.svgLabel = self.svg.text(element._private.svgGroup, labelPosition.x, labelPosition.y, "label init");
		
		element._private.svg = svgPath;
		return svgPath;
	};
	
	
	SvgRenderer.prototype.markerDrawFix = function(){
		this.forceRedraw();
	};
	
	SvgRenderer.prototype.forceRedraw = function(){
		this.svg.change(this.svgRoot, {
			opacity: 0
		});
		
		this.svg.change(this.svgRoot, {
			opacity: Math.random()
		});
		
		this.svg.change(this.svgRoot, {
			opacity: 1
		});
		
		var rect = this.svg.rect(0, 0, this.container.width(), this.container.height());
		this.svg.remove(rect);
	};
	
	SvgRenderer.prototype.getAngle = function(p1, p2){
		var rad2deg = function(rad){
			return rad * 180/Math.PI;
		};
		
		var h = this.getDistance(p1, p2);
		var dx = p2.x - p1.x;
		var dy = -1*(p2.y - p1.y);
		var acos = rad2deg( Math.acos( dx/h ) );
		
		if( dy < 0 ){
			return 360 - acos;
		} else {
			return acos;
		}

	};
	
	SvgRenderer.prototype.getOrthogonalPoint = function(p1, p2, h){
		var diff = { x: p1.x-p2.x, y: p1.y-p2.y };
	    var normal = this.getNormalizedPoint({ x: diff.y, y: -diff.x }, 1);
	    
	    var mid = { x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2 };
	    
	    return {x: mid.x + normal.x * h, y: mid.y + normal.y * h};
	};
	
	SvgRenderer.prototype.getPointAlong = function(p1, p2, h, p0){
		var slope = { x: p2.x-p1.x, y: p2.y-p1.y };
	    var normalSlope = this.getNormalizedPoint({ x: slope.x, y: slope.y }, 1);
	    
	    if( p0 == null ){
	    	p0 = p2;
	    }
	    
	    return {
	    	x: p0.x + normalSlope.x * h,
	    	y: p0.y + normalSlope.y * h
	    };
	};
	
	SvgRenderer.prototype.getNormalizedPoint = function(p, newLength){
		var currentLength = Math.sqrt(p.x*p.x + p.y*p.y);
		var factor = newLength / currentLength;
		
		return {
			x: p.x * factor,
			y: p.y * factor
		};
	};
	
	SvgRenderer.prototype.getDistance = function(p1, p2){
		return Math.sqrt( (p2.x - p1.x)*(p2.x - p1.x) + (p2.y - p1.y)*(p2.y - p1.y) );
	};
	
	SvgRenderer.prototype.makeSvgEdge = function(element){
		var self = this;
		var source = element.source();
		var target = element.target();
					
		if( source == null || target == null ){
			$.cytoscapeweb("debug", "SVG renderer is ignoring creating of edge `%s` with missing nodes");
			return;
		}
		
		var ps = source._private.position;
		var pt = target._private.position;
		
		if( ps.x == null || ps.y == null || pt.x == null || pt.y == null ){
			$.cytoscapeweb("debug", "SVG renderer is ignoring creating of edge `%s` with position (%o, %o, %o, %o)", element._private.data.id, ps.x, ps.y, pt.x, pt.y);
			return;
		}
		
		var style = this.calculateStyle(element);
		
		var svgDomGroup = this.svg.group(this.edgesGroup);
		element._private.svgGroup = svgDomGroup;
		this.svg.change(svgDomGroup);
		
		// notation: (x1, y1, x2, y2) = (source.x, source.y, target.x, target.y)
		this.makeSvgEdgePath(element);
		
		$.cytoscapeweb("debug", "SVG renderer made edge `%s` with position (%i, %i, %i, %i)", element._private.data.id, ps.x, ps.y, pt.x, pt.y);
		
		this.makeSvgEdgeInteractive(element);
		this.updateElementStyle(element, style);
		return element._private.svg;
	};
	
	SvgRenderer.prototype.makeSvgElement = function(element){
		var svgDomElement;
		
		if( element.group() == "nodes" ){
			svgDomElement = this.makeSvgNode(element);
		} else if( element.group() == "edges" ){
			svgDomElement = this.makeSvgEdge(element);
		}
		
		return svgDomElement;
	};
	
	SvgRenderer.prototype.getSvgElement = function(element){
		if( element._private.svg != null ){
			return element._private.svg;
		} else {
			return this.makeSvgElement(element);
		}
	};
	
	SvgRenderer.prototype.updateSelection = function(collection){
		this.updateElementsStyle(collection);
	};
	
	SvgRenderer.prototype.updateData = function(collection){
		this.updateElementsStyle(collection);
	};
	
	SvgRenderer.prototype.updateMapperBounds = function(collection){
		
		var elements = cy.elements().filter(function(){
			return this.group() == collection[0].group();
		}).not(collection);
		
		this.updateElementsStyle( elements );
	};
	
	SvgRenderer.prototype.updateElementsStyle = function(collection){
		var self = this;
		collection = collection.collection();
		
		// update nodes
		collection.nodes().each(function(i, element){
			self.updateElementStyle(element);
		});
		
		// update edges
		collection.edges().each(function(i, element){
			self.updateElementStyle(element);
		});
		
		// update positions of connected edges but not those already covered by the update for edges above
		collection.nodes().neighborhood().edges().not( collection.edges() ).each(function(i, element){
			self.updatePosition(element);
		});
	};
	
	SvgRenderer.prototype.updateStyle = function(style){
		var collection = this.cy.elements();
		var self = this;
		
		if( style !== undefined ){
			self.style = style;
		}
		
		this.updateElementsStyle(collection);
	};
	
	SvgRenderer.prototype.updateBypass = function(collection){
		var self = this;
		collection = collection.collection();
		
		// update nodes
		collection.nodes().each(function(i, element){
			self.updateElementStyle(element);
		});
		
		// update connected edges
		collection.edges().add( collection.closedNeighborhood().edges() ).each(function(i, edge){
			self.updateElementStyle(edge);
		});
	};
	
	SvgRenderer.prototype.updateElementStyle = function(element, newStyle){
		if( element.isNode() ){
			this.updateNodeStyle(element, newStyle);
		} else if( element.isEdge() ){
			this.updateEdgeStyle(element, newStyle);
		}
	};
	
	SvgRenderer.prototype.updateNodeStyle = function(element, newStyle){
		element._private.style = newStyle != null ? newStyle : this.calculateStyle(element);
		var style = element._private.style;
		
		if( element._private.svg == null ){
			$.cytoscapeweb("error", "SVG renderer can not update style for node `%s` since it has no SVG element", element._private.data.id);
			return;
		}
			
		// TODO add more as more styles are added
		// generic styles go here
		this.svg.change(element._private.svg, {
			"pointer-events": "visible", // if visibility:hidden, no events
			fill: color(style.fillColor),
			fillOpacity: percent(style.fillOpacity),
			stroke: color(style.borderColor),
			strokeWidth: number(style.borderWidth),
			strokeDashArray: lineStyle(style.borderStyle).array,
			strokeOpacity: percent(style.borderOpacity),
			cursor: cursor(style.cursor),
			"visibility": visibility(style.visibility)
		});
		
		// styles for label
		this.svg.change(element._private.svgLabel, {
			"visibility": visibility(style.visibility),
			"pointer-events": "none",
			fill: color(style.labelFillColor),
			fillOpacity: percent(style.labelFillOpacity),
			stroke: color(style.labelOutlineColor),
			strokeWidth: number(style.labelOutlineWidth),
			strokeOpacity: percent(style.labelOutlineOpacity),
			"font-family": style.labelFontFamily,
			"font-weight": style.labelFontWeight,
			"font-style": style.labelFontStyle,
			"text-decoration": style.labelFontDecoration,
			"font-variant": style.labelFontVariant,
			"font-size": style.labelFontSize
		});
		
		element._private.svgLabel.textContent = style.labelText == null ? "" : style.labelText;
		
		var valign = labelValign(style.labelValign);
		var halign = labelHalign(style.labelHalign);
		
		this.updateLabelPosition(element, valign, halign);
		
		// styles to the group
		this.svg.change(element._private.svgGroup, {
			fillOpacity: percent(style.fillOpacity)
		});
		
		nodeShape(style.shape).update(this.svg, this.nodesGroup, element, element._private.position, style);
		
		$.cytoscapeweb("debug", "SVG renderer collapsed mappers and updated style for node `%s` to %o", element._private.data.id, style);
	};
	
	SvgRenderer.prototype.updateLabelPosition = function(element, valign, halign){
		var spacing = 3;
		var dx = 0;
		var dy = 0;
		var height = 0;
		var width = 0;
		var text = element._private.svgLabel.textContent;
		
		if( text == null || text == "" ){
			return;
		}
		
		if( element.isNode() ){
			height = element._private.style.height;
			width = element._private.style.width;
		}
		
		if( halign == "middle" ){
			this.svg.change(element._private.svgLabel, {
				"text-anchor": "middle"
			});
		} else if( halign == "right" ){
			this.svg.change(element._private.svgLabel, {
				"text-anchor": "start"
			});
			dx = width/2 + spacing;
		} else if( halign == "left" ){
			this.svg.change(element._private.svgLabel, {
				"text-anchor": "end"
			});
			dx = -width/2 - spacing;
		}
		
		// TODO remove this hack to fix IE when it supports baseline properties properly
		var fontSize = parseInt(window.getComputedStyle(element._private.svgLabel)["fontSize"]);
		var ieFix = $.browser.msie ? fontSize/3 : 0;
	
		if( valign == "middle" ){
			this.svg.change(element._private.svgLabel, {
				"style": "alignment-baseline: central; dominant-baseline: central;"
			});
			dy = 0 + ieFix;
		} else if( valign == "top" ){
			this.svg.change(element._private.svgLabel, {
				"style": "alignment-baseline: normal; dominant-baseline: normal;"	
			});
			dy = -height/2 - spacing;
		} else if( valign == "bottom" ){
			this.svg.change(element._private.svgLabel, {
				"style": "alignment-baseline: normal; dominant-baseline: normal;"
			});
			dy = height/2 + fontSize;
		}
		
		this.svg.change(element._private.svgLabel, {
			transform: "translate("+ dx +","+ dy +")"
		});
	};
	
	SvgRenderer.prototype.updateEdgeStyle = function(element, newStyle){
		element._private.style = newStyle != null ? newStyle : this.calculateStyle(element);
		var style = element._private.style;
		
		if( element._private.svg == null ){
			$.cytoscapeweb("error", "SVG renderer can not update style for edge `%s` since it has no SVG element", element._private.data.id);
			return;
		}
		
		// TODO add more as more styles are added
		// generic edge styles go here
		this.svg.change(element._private.svg, {
			"pointer-events": "visibleStroke", // on visibility:hidden, no events
			stroke: color(style.lineColor),
			strokeWidth: number(style.width),
			strokeDashArray: lineStyle(style.style).array,
			"stroke-linecap": "butt", // disable for now for markers to line up nicely
			opacity: percent(style.opacity),
			cursor: cursor(style.cursor),
			fill: "none",
			visibility: visibility(style.visibility)
		});
		
		this.svg.change(element._private.targetSvg, {
			fill: color(style.targetArrowColor),
			cursor: cursor(style.cursor),
			visibility: visibility(style.visibility)
		});
		
		this.svg.change(element._private.sourceSvg, {
			fill: color(style.sourceArrowColor),
			cursor: cursor(style.cursor),
			visibility: visibility(style.visibility)
		});
		
		this.svg.change(element._private.svgLabel, {
			"visibility": visibility(style.visibility),
			"pointer-events": "none",
			fill: color(style.labelFillColor),
			fillOpacity: percent(style.labelFillOpacity),
			stroke: color(style.labelOutlineColor),
			strokeWidth: number(style.labelOutlineWidth),
			strokeOpacity: percent(style.labelOutlineOpacity),
			"font-family": style.labelFontFamily,
			"font-weight": style.labelFontWeight,
			"font-style": style.labelFontStyle,
			"text-decoration": style.labelFontDecoration,
			"font-variant": style.labelFontVariant,
			"font-size": style.labelFontSize
		});
		
		element._private.svgLabel.textContent = style.labelText == null ? "" : style.labelText;
		this.updateLabelPosition(element, "middle", "middle");
		
		$.cytoscapeweb("debug", "SVG renderer collapsed mappers and updated style for edge `%s` to %o", element._private.data.id, style);
	};
	
	SvgRenderer.prototype.addElements = function(collection){
		
		var self = this;
		var cy = this.cy;
		
		collection.nodes().each(function(i, element){
			self.makeSvgElement(element);
		});
		
		collection.edges().each(function(i, element){
			self.makeSvgElement(element);
		});
		
		self.positionEdges( collection.edges().parallelEdges() );

		self.updateElementsStyle( cy.nodes().not(collection) );
	};
	
	SvgRenderer.prototype.updatePosition = function(collection){
		
		$.cytoscapeweb("debug", "SVG renderer is updating node positions");
		
		collection = collection.collection();
		var container = $(this.options.selector);
		var svg = container.svg('get');
		var self = this;
		var cy = this.options.cytoscapeweb;
		
		// update nodes
		collection.nodes().each(function(i, element){
			var svgEle = self.getSvgElement(element);			
			var p = element._private.position;
			
			self.updateNodePositionFromShape(element);
			self.positionSvgNodeLabel(element);

			$.cytoscapeweb("debug", "SVG renderer is moving node `%s` to position (%o, %o)", element._private.data.id, p.x, p.y);
		});
		
		// update connected edges
		self.positionEdges( collection.closedNeighborhood().edges() );
		
	};
	
	SvgRenderer.prototype.positionEdges = function(edges){
		var self = this;
		
		edges.each(function(i, edge){
			if( edge._private.svgGroup != null ){
				self.svg.remove(edge._private.svgGroup);
			}
			self.makeSvgEdge(edge);
			
			var ps = edge.source()._private.position;
			var pt = edge.target()._private.position;
			
			$.cytoscapeweb("debug", "SVG renderer is moving edge `%s` to position (%o, %o, %o, %o)", edge._private.data.id, ps.x, ps.y, pt.x, pt.y);
		});
	};
	
	SvgRenderer.prototype.removeElements = function(collection){
		$.cytoscapeweb("debug", "SVG renderer is removing elements");
		
		var container = $(this.options.selector);
		var svg = container.svg('get');
		var cy = this.options.cytoscapeweb;
		var self = this;
		
		collection.each(function(i, element){
			if( element._private.svgGroup != null ){
				svg.remove(element._private.svgGroup);
				delete element._private.svg;
				delete element._private.svgGroup;
				delete element._private.sourceSvg;
				delete element._private.targetSvg;
				// TODO add delete other svg children like labels
			} else {
				$.cytoscapeweb("debug", "Element with group `%s` and ID `%s` has no associated SVG element", element._private.group, element._private.data.id);
			}
			
		});
		
		if( self.selectedElements != null ){
			self.selectedElements = self.selectedElements.not(collection);
		}
		
		this.updateElementsStyle( cy.nodes() );
	};
	
	SvgRenderer.prototype.notify = function(params){
		var container = $(params.selector);
	
		$.cytoscapeweb("debug", "Notify SVG renderer with params (%o)", params);
		
		if( params.type == null ){
			$.cytoscapeweb("error", "The SVG renderer should be notified with a `type` field");
			return;
		}
		
		var self = this;
		switch( params.type ){
			case "load":
				self.init(function(){
					self.addElements( params.collection );
					container.trigger("rendered");
				});
				break;
		
			case "add":
				this.addElements( params.collection );
				break;
			
			case "remove":
				this.removeElements( params.collection );
				break;
			
			case "position":
				this.updatePosition( params.collection );
				break;
			
			case "style":
				this.updateStyle( params.style );
				break;
				
			case "bypass":
				this.updateBypass( params.collection );
				break;
				
			case "data":
				this.updateData( params.collection );
				break;
			
			case "mapperbounds":
				this.updateMapperBounds( params.collection );
				break;
				
			case "select":
			case "unselect":
				this.updateSelection( params.collection );
				break;
				
			default:
				$.cytoscapeweb("debug", "The SVG renderer doesn't consider the `%s` event", params.type);
				break;
		}
	};

	function SvgExporter(options){
		this.options = options;
		this.cy = options.cy;
		this.renderer = options.renderer;
		
		if( this.renderer.name() != "svg" ){
			$.cytoscapeweb("error", "The SVG exporter can be used only if the SVG renderer is used");
		}
	}
	
	SvgExporter.prototype.run = function(){
		return $(this.options.selector).svg("get").toSVG();
	};
	
	$.cytoscapeweb("renderer", "svg", SvgRenderer);
	$.cytoscapeweb("exporter", "svg", SvgExporter);
	
});