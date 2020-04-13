
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.20.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var PROFIL_DATA = {
      "AVATAR": {
        "alt": "ceci est ma photo",
        "src": "./static/media/avatar/avatar.png"
      },
      "PROFESSION": "Front End Developer",
      "FIRSTNAME": "pascal",
      "LASTNAME": "soulier"
    };
    var SKILLS_DATA = {
      "TITLE": "skills",
      "LISTS": [{
        "cat_title": "programming languages",
        "cat_items": [{
          "name": "html",
          "level": 80
        }, {
          "name": "css",
          "level": 75
        }, {
          "name": "javascript",
          "level": 65
        }, {
          "name": "accessibility",
          "level": 60
        }]
      }, {
        "cat_title": "frameworks",
        "cat_items": [{
          "name": "sass",
          "level": 70
        }, {
          "name": "less",
          "level": 65
        }, {
          "name": "jquery",
          "level": 75
        }, {
          "name": "vue",
          "level": 50
        }, {
          "name": "angular",
          "level": 55
        }, {
          "name": "react",
          "level": 45
        }]
      }]
    };
    var TOOLS_DATA = {
      "TITLE": "tools",
      "LISTS": ["git", "grunt", "brunch", "middleman", "photoshop", "fireworks", "illustrator", "indesign", "dreamweaver", "figma", "prestashop", "wordpress", "drupal", "sublime text", "notepad++", "coda", "visual studio code"]
    };
    var TRUST_DATA = {
      "TITLE": " they trusted me",
      "COMPANIES": [{
        "name": "lwm",
        "logo": "path"
      }, {
        "name": "pmu",
        "logo": "path"
      }, {
        "name": "société générale",
        "logo": "path"
      }, {
        "name": "imagine",
        "logo": "path"
      }, {
        "name": "louis vuitton",
        "logo": "path"
      }]
    };
    var CV_DATA = {
      "TITLE": "donwload my cv",
      "URL": "/assets/Pascal-Soulier-Front-End.pdf"
    };
    var SOCIAL_DATA = {
      "LISTS": [{
        "name": "linkedin",
        "url": "https://www.linkedin.com/in/pascal-soulier-a52bb983/",
        "rel": "external",
        "target": "_target"
      }, {
        "name": "tweeter",
        "url": "https://twitter.com/Sp_Devfront",
        "rel": "external",
        "target": "_target"
      }]
    };
    var COPYRIGHT_DATA = {
      "TEXT": "copyright © pascal Soulier 2020"
    };
    var MOCK_DATA = {
      PROFIL_DATA: PROFIL_DATA,
      SKILLS_DATA: SKILLS_DATA,
      TOOLS_DATA: TOOLS_DATA,
      TRUST_DATA: TRUST_DATA,
      CV_DATA: CV_DATA,
      SOCIAL_DATA: SOCIAL_DATA,
      COPYRIGHT_DATA: COPYRIGHT_DATA
    };

    /* src/components/avatar/Avatar.svelte generated by Svelte v3.20.1 */

    const file = "src/components/avatar/Avatar.svelte";

    function create_fragment(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			attr_dev(img, "alt", /*alt*/ ctx[1]);
    			if (img.src !== (img_src_value = /*src*/ ctx[2])) attr_dev(img, "src", img_src_value);
    			toggle_class(img, "rounded", /*rounded*/ ctx[0]);
    			add_location(img, file, 7, 4, 141);
    			attr_dev(div, "classname", "Avatar");
    			add_location(div, file, 6, 0, 112);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*rounded*/ 1) {
    				toggle_class(img, "rounded", /*rounded*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { avatar = {} } = $$props;
    	const { alt, src } = avatar;
    	let { rounded = true } = $$props;
    	const writable_props = ["avatar", "rounded"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Avatar> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Avatar", $$slots, []);

    	$$self.$set = $$props => {
    		if ("avatar" in $$props) $$invalidate(3, avatar = $$props.avatar);
    		if ("rounded" in $$props) $$invalidate(0, rounded = $$props.rounded);
    	};

    	$$self.$capture_state = () => ({ avatar, alt, src, rounded });

    	$$self.$inject_state = $$props => {
    		if ("avatar" in $$props) $$invalidate(3, avatar = $$props.avatar);
    		if ("rounded" in $$props) $$invalidate(0, rounded = $$props.rounded);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [rounded, alt, src, avatar];
    }

    class Avatar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { avatar: 3, rounded: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Avatar",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get avatar() {
    		throw new Error("<Avatar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set avatar(value) {
    		throw new Error("<Avatar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rounded() {
    		throw new Error("<Avatar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rounded(value) {
    		throw new Error("<Avatar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/heading/Profil.svelte generated by Svelte v3.20.1 */

    const file$1 = "src/components/heading/Profil.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let t1;
    	let h2;
    	let t2;
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(/*profession*/ ctx[0]);
    			t1 = space();
    			h2 = element("h2");
    			t2 = text(/*firstname*/ ctx[1]);
    			t3 = space();
    			t4 = text(/*lastname*/ ctx[2]);
    			add_location(h1, file$1, 8, 4, 136);
    			add_location(h2, file$1, 9, 4, 162);
    			attr_dev(div, "classname", "Profession");
    			add_location(div, file$1, 7, 0, 103);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(div, t1);
    			append_dev(div, h2);
    			append_dev(h2, t2);
    			append_dev(h2, t3);
    			append_dev(h2, t4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*profession*/ 1) set_data_dev(t0, /*profession*/ ctx[0]);
    			if (dirty & /*firstname*/ 2) set_data_dev(t2, /*firstname*/ ctx[1]);
    			if (dirty & /*lastname*/ 4) set_data_dev(t4, /*lastname*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { profession } = $$props;
    	let { firstname } = $$props;
    	let { lastname } = $$props;
    	const writable_props = ["profession", "firstname", "lastname"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Profil> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Profil", $$slots, []);

    	$$self.$set = $$props => {
    		if ("profession" in $$props) $$invalidate(0, profession = $$props.profession);
    		if ("firstname" in $$props) $$invalidate(1, firstname = $$props.firstname);
    		if ("lastname" in $$props) $$invalidate(2, lastname = $$props.lastname);
    	};

    	$$self.$capture_state = () => ({ profession, firstname, lastname });

    	$$self.$inject_state = $$props => {
    		if ("profession" in $$props) $$invalidate(0, profession = $$props.profession);
    		if ("firstname" in $$props) $$invalidate(1, firstname = $$props.firstname);
    		if ("lastname" in $$props) $$invalidate(2, lastname = $$props.lastname);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [profession, firstname, lastname];
    }

    class Profil extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { profession: 0, firstname: 1, lastname: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profil",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*profession*/ ctx[0] === undefined && !("profession" in props)) {
    			console.warn("<Profil> was created without expected prop 'profession'");
    		}

    		if (/*firstname*/ ctx[1] === undefined && !("firstname" in props)) {
    			console.warn("<Profil> was created without expected prop 'firstname'");
    		}

    		if (/*lastname*/ ctx[2] === undefined && !("lastname" in props)) {
    			console.warn("<Profil> was created without expected prop 'lastname'");
    		}
    	}

    	get profession() {
    		throw new Error("<Profil>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set profession(value) {
    		throw new Error("<Profil>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get firstname() {
    		throw new Error("<Profil>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set firstname(value) {
    		throw new Error("<Profil>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lastname() {
    		throw new Error("<Profil>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lastname(value) {
    		throw new Error("<Profil>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/buttons/social/Social.svelte generated by Svelte v3.20.1 */

    const file$2 = "src/components/buttons/social/Social.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i].name;
    	child_ctx[3] = list[i].url;
    	child_ctx[4] = list[i].rel;
    	child_ctx[5] = list[i].target;
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (8:8) {#each LISTS as { name, url, rel, target }
    function create_each_block(ctx) {
    	let li;
    	let a;
    	let t0_value = /*name*/ ctx[2] + "";
    	let t0;
    	let a_href_value;
    	let a_rel_value;
    	let a_target_value;
    	let a_data_name_value;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*url*/ ctx[3]);
    			attr_dev(a, "rel", a_rel_value = /*rel*/ ctx[4]);
    			attr_dev(a, "target", a_target_value = /*target*/ ctx[5]);
    			attr_dev(a, "data-name", a_data_name_value = /*name*/ ctx[2]);
    			add_location(a, file$2, 9, 16, 249);
    			attr_dev(li, "classname", "item");
    			add_location(li, file$2, 8, 12, 211);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(8:8) {#each LISTS as { name, url, rel, target }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let ul;
    	let each_value = /*LISTS*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "classname", "social-list");
    			add_location(ul, file$2, 6, 4, 115);
    			attr_dev(div, "classname", "social");
    			add_location(div, file$2, 5, 0, 86);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*LISTS*/ 1) {
    				each_value = /*LISTS*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { socialData = {} } = $$props;
    	const { LISTS } = socialData;
    	const writable_props = ["socialData"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Social> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Social", $$slots, []);

    	$$self.$set = $$props => {
    		if ("socialData" in $$props) $$invalidate(1, socialData = $$props.socialData);
    	};

    	$$self.$capture_state = () => ({ socialData, LISTS });

    	$$self.$inject_state = $$props => {
    		if ("socialData" in $$props) $$invalidate(1, socialData = $$props.socialData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [LISTS, socialData];
    }

    class Social extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { socialData: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Social",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get socialData() {
    		throw new Error("<Social>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set socialData(value) {
    		throw new Error("<Social>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/buttons/switch/Switch.svelte generated by Svelte v3.20.1 */

    const file$3 = "src/components/buttons/switch/Switch.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let label;
    	let input;
    	let t;
    	let span;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			input = element("input");
    			t = space();
    			span = element("span");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "svelte-1w0pdmf");
    			add_location(input, file$3, 23, 8, 700);
    			attr_dev(span, "class", "slider round svelte-1w0pdmf");
    			add_location(span, file$3, 26, 8, 793);
    			attr_dev(label, "class", "switch svelte-1w0pdmf");
    			add_location(label, file$3, 22, 4, 669);
    			attr_dev(div, "classname", "switch-theme-btn");
    			add_location(div, file$3, 21, 0, 630);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(label, input);
    			input.checked = /*checked*/ ctx[0];
    			append_dev(label, t);
    			append_dev(label, span);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "change", /*input_change_handler*/ ctx[3]),
    				listen_dev(input, "change", /*toggleThemeChange*/ ctx[1], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const currentTheme = localStorage.getItem("theme");
    	let checked = currentTheme === "dark" ? true : false;

    	currentTheme === "dark"
    	? window.document.body.classList.add("dark")
    	: window.document.body.classList.remove("dark");

    	function toggleThemeChange() {
    		if (checked === true) {
    			// Update localstorage
    			localStorage.setItem("theme", "dark");

    			window.document.body.classList.add("dark");
    		} else {
    			// Update localstorage
    			localStorage.removeItem("theme");

    			window.document.body.classList.remove("dark");
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Switch> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Switch", $$slots, []);

    	function input_change_handler() {
    		checked = this.checked;
    		$$invalidate(0, checked);
    	}

    	$$self.$capture_state = () => ({ currentTheme, checked, toggleThemeChange });

    	$$self.$inject_state = $$props => {
    		if ("checked" in $$props) $$invalidate(0, checked = $$props.checked);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [checked, toggleThemeChange, currentTheme, input_change_handler];
    }

    class Switch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Switch",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/containers/Header_container.svelte generated by Svelte v3.20.1 */
    const file$4 = "src/containers/Header_container.svelte";

    function create_fragment$4(ctx) {
    	let header;
    	let t0;
    	let t1;
    	let t2;
    	let current;

    	const avatar = new Avatar({
    			props: { avatar: /*AVATAR*/ ctx[1] },
    			$$inline: true
    		});

    	const profil = new Profil({
    			props: {
    				profession: /*PROFESSION*/ ctx[2],
    				firstname: /*FIRSTNAME*/ ctx[3],
    				lastname: /*LASTNAME*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const social = new Social({
    			props: { socialData: /*socialData*/ ctx[0] },
    			$$inline: true
    		});

    	const switch_1 = new Switch({ $$inline: true });

    	const block = {
    		c: function create() {
    			header = element("header");
    			create_component(avatar.$$.fragment);
    			t0 = space();
    			create_component(profil.$$.fragment);
    			t1 = space();
    			create_component(social.$$.fragment);
    			t2 = space();
    			create_component(switch_1.$$.fragment);
    			add_location(header, file$4, 12, 0, 412);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			mount_component(avatar, header, null);
    			append_dev(header, t0);
    			mount_component(profil, header, null);
    			append_dev(header, t1);
    			mount_component(social, header, null);
    			append_dev(header, t2);
    			mount_component(switch_1, header, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const social_changes = {};
    			if (dirty & /*socialData*/ 1) social_changes.socialData = /*socialData*/ ctx[0];
    			social.$set(social_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(avatar.$$.fragment, local);
    			transition_in(profil.$$.fragment, local);
    			transition_in(social.$$.fragment, local);
    			transition_in(switch_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(avatar.$$.fragment, local);
    			transition_out(profil.$$.fragment, local);
    			transition_out(social.$$.fragment, local);
    			transition_out(switch_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(avatar);
    			destroy_component(profil);
    			destroy_component(social);
    			destroy_component(switch_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { headingProfilData = {} } = $$props;
    	const { AVATAR, PROFESSION, FIRSTNAME, LASTNAME } = headingProfilData;
    	let { socialData } = $$props;
    	const writable_props = ["headingProfilData", "socialData"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header_container> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Header_container", $$slots, []);

    	$$self.$set = $$props => {
    		if ("headingProfilData" in $$props) $$invalidate(5, headingProfilData = $$props.headingProfilData);
    		if ("socialData" in $$props) $$invalidate(0, socialData = $$props.socialData);
    	};

    	$$self.$capture_state = () => ({
    		Avatar,
    		Profil,
    		Social,
    		Switch,
    		headingProfilData,
    		AVATAR,
    		PROFESSION,
    		FIRSTNAME,
    		LASTNAME,
    		socialData
    	});

    	$$self.$inject_state = $$props => {
    		if ("headingProfilData" in $$props) $$invalidate(5, headingProfilData = $$props.headingProfilData);
    		if ("socialData" in $$props) $$invalidate(0, socialData = $$props.socialData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [socialData, AVATAR, PROFESSION, FIRSTNAME, LASTNAME, headingProfilData];
    }

    class Header_container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { headingProfilData: 5, socialData: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header_container",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*socialData*/ ctx[0] === undefined && !("socialData" in props)) {
    			console.warn("<Header_container> was created without expected prop 'socialData'");
    		}
    	}

    	get headingProfilData() {
    		throw new Error("<Header_container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headingProfilData(value) {
    		throw new Error("<Header_container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get socialData() {
    		throw new Error("<Header_container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set socialData(value) {
    		throw new Error("<Header_container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/skills/Skills.svelte generated by Svelte v3.20.1 */

    const file$5 = "src/components/skills/Skills.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i].name;
    	child_ctx[8] = list[i].level;
    	child_ctx[6] = i;
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i].cat_title;
    	child_ctx[4] = list[i].cat_items;
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (16:16) {#each cat_items as { name, level }
    function create_each_block_1(ctx) {
    	let li;
    	let div0;
    	let t0_value = /*name*/ ctx[7] + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = /*level*/ ctx[8] + "";
    	let t2;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			attr_dev(div0, "classname", "cat-item-title");
    			add_location(div0, file$5, 17, 24, 519);
    			attr_dev(div1, "classname", "cat-item-level");
    			add_location(div1, file$5, 18, 24, 588);
    			attr_dev(li, "classname", "cat-item");
    			add_location(li, file$5, 16, 20, 469);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div0);
    			append_dev(div0, t0);
    			append_dev(li, t1);
    			append_dev(li, div1);
    			append_dev(div1, t2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(16:16) {#each cat_items as { name, level }",
    		ctx
    	});

    	return block;
    }

    // (11:8) {#each LISTS as { cat_title, cat_items }
    function create_each_block$1(ctx) {
    	let div;
    	let t0_value = /*cat_title*/ ctx[3] + "";
    	let t0;
    	let t1;
    	let ul;
    	let t2;
    	let each_value_1 = /*cat_items*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			attr_dev(div, "classname", "cat-title");
    			add_location(div, file$5, 11, 12, 275);
    			attr_dev(ul, "classname", "cat_item-list");
    			add_location(ul, file$5, 14, 12, 362);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*LISTS*/ 2) {
    				each_value_1 = /*cat_items*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(11:8) {#each LISTS as { cat_title, cat_items }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let each_value = /*LISTS*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = `${/*TITLE*/ ctx[0]}`;
    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "classname", "skills-title");
    			add_location(div0, file$5, 6, 4, 122);
    			attr_dev(div1, "classname", "cat-box");
    			add_location(div1, file$5, 9, 4, 184);
    			attr_dev(div2, "classname", "skills");
    			add_location(div2, file$5, 5, 0, 93);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*LISTS*/ 2) {
    				each_value = /*LISTS*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { skillsData = {} } = $$props;
    	const { TITLE, LISTS } = skillsData;
    	const writable_props = ["skillsData"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Skills> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Skills", $$slots, []);

    	$$self.$set = $$props => {
    		if ("skillsData" in $$props) $$invalidate(2, skillsData = $$props.skillsData);
    	};

    	$$self.$capture_state = () => ({ skillsData, TITLE, LISTS });

    	$$self.$inject_state = $$props => {
    		if ("skillsData" in $$props) $$invalidate(2, skillsData = $$props.skillsData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [TITLE, LISTS, skillsData];
    }

    class Skills extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { skillsData: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get skillsData() {
    		throw new Error("<Skills>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skillsData(value) {
    		throw new Error("<Skills>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/tools/Tools.svelte generated by Svelte v3.20.1 */

    const file$6 = "src/components/tools/Tools.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (11:8) {#each LISTS as list, i}
    function create_each_block$2(ctx) {
    	let li;
    	let t0_value = /*list*/ ctx[3] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(li, "classname", "tools-item");
    			add_location(li, file$6, 11, 12, 259);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(11:8) {#each LISTS as list, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let ul;
    	let each_value = /*LISTS*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = `${/*TITLE*/ ctx[0]}`;
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "classname", "tools-title");
    			add_location(div0, file$6, 6, 4, 119);
    			attr_dev(ul, "classname", "tools-items-list");
    			add_location(ul, file$6, 9, 4, 180);
    			attr_dev(div1, "classname", "tools");
    			add_location(div1, file$6, 5, 0, 91);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*LISTS*/ 2) {
    				each_value = /*LISTS*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { toolsData = {} } = $$props;
    	const { TITLE, LISTS } = toolsData;
    	const writable_props = ["toolsData"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tools> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Tools", $$slots, []);

    	$$self.$set = $$props => {
    		if ("toolsData" in $$props) $$invalidate(2, toolsData = $$props.toolsData);
    	};

    	$$self.$capture_state = () => ({ toolsData, TITLE, LISTS });

    	$$self.$inject_state = $$props => {
    		if ("toolsData" in $$props) $$invalidate(2, toolsData = $$props.toolsData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [TITLE, LISTS, toolsData];
    }

    class Tools extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { toolsData: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tools",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get toolsData() {
    		throw new Error("<Tools>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toolsData(value) {
    		throw new Error("<Tools>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/trust/Trust.svelte generated by Svelte v3.20.1 */

    const file$7 = "src/components/trust/Trust.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i].name;
    	child_ctx[4] = list[i].logo;
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (11:8) {#each COMPANIES as { name, logo }
    function create_each_block$3(ctx) {
    	let li;
    	let div;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			img = element("img");
    			t = space();
    			if (img.src !== (img_src_value = /*logo*/ ctx[4])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*name*/ ctx[3]);
    			add_location(img, file$7, 13, 20, 355);
    			attr_dev(div, "classname", "logo");
    			add_location(div, file$7, 12, 16, 312);
    			attr_dev(li, "classname", "item");
    			add_location(li, file$7, 11, 12, 274);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, img);
    			append_dev(li, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(11:8) {#each COMPANIES as { name, logo }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let ul;
    	let each_value = /*COMPANIES*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = `${/*TITLE*/ ctx[0]}`;
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "classname", "trust_title");
    			add_location(div0, file$7, 6, 4, 122);
    			attr_dev(ul, "classname", "companies-list");
    			add_location(ul, file$7, 9, 4, 183);
    			attr_dev(div1, "classname", "trust");
    			add_location(div1, file$7, 5, 0, 94);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*COMPANIES*/ 2) {
    				each_value = /*COMPANIES*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { trustData = {} } = $$props;
    	const { TITLE, COMPANIES } = trustData;
    	const writable_props = ["trustData"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Trust> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Trust", $$slots, []);

    	$$self.$set = $$props => {
    		if ("trustData" in $$props) $$invalidate(2, trustData = $$props.trustData);
    	};

    	$$self.$capture_state = () => ({ trustData, TITLE, COMPANIES });

    	$$self.$inject_state = $$props => {
    		if ("trustData" in $$props) $$invalidate(2, trustData = $$props.trustData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [TITLE, COMPANIES, trustData];
    }

    class Trust extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { trustData: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Trust",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get trustData() {
    		throw new Error("<Trust>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trustData(value) {
    		throw new Error("<Trust>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/buttons/download/download.svelte generated by Svelte v3.20.1 */

    const file$8 = "src/components/buttons/download/download.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let button;
    	let a;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(/*TITLE*/ ctx[0]);
    			t1 = space();
    			button = element("button");
    			a = element("a");
    			t2 = text(/*TITLE*/ ctx[0]);
    			attr_dev(a, "href", /*URL*/ ctx[1]);
    			add_location(a, file$8, 8, 8, 165);
    			attr_dev(button, "classname", "cv-btn");
    			add_location(button, file$8, 7, 4, 129);
    			attr_dev(div, "classname", "download-cv");
    			add_location(div, file$8, 5, 0, 83);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, button);
    			append_dev(button, a);
    			append_dev(a, t2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { cvData = {} } = $$props;
    	const { TITLE, URL } = cvData;
    	const writable_props = ["cvData"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Download> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Download", $$slots, []);

    	$$self.$set = $$props => {
    		if ("cvData" in $$props) $$invalidate(2, cvData = $$props.cvData);
    	};

    	$$self.$capture_state = () => ({ cvData, TITLE, URL });

    	$$self.$inject_state = $$props => {
    		if ("cvData" in $$props) $$invalidate(2, cvData = $$props.cvData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [TITLE, URL, cvData];
    }

    class Download extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { cvData: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Download",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get cvData() {
    		throw new Error("<Download>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cvData(value) {
    		throw new Error("<Download>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/containers/Home_container.svelte generated by Svelte v3.20.1 */

    function create_fragment$9(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let current;

    	const skills = new Skills({
    			props: { skillsData: /*skillsData*/ ctx[0] },
    			$$inline: true
    		});

    	const tools = new Tools({
    			props: { toolsData: /*toolsData*/ ctx[1] },
    			$$inline: true
    		});

    	const trust = new Trust({
    			props: { trustData: /*trustData*/ ctx[2] },
    			$$inline: true
    		});

    	const download = new Download({
    			props: { cvData: /*cvData*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(skills.$$.fragment);
    			t0 = space();
    			create_component(tools.$$.fragment);
    			t1 = space();
    			create_component(trust.$$.fragment);
    			t2 = space();
    			create_component(download.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(skills, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(tools, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(trust, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(download, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const skills_changes = {};
    			if (dirty & /*skillsData*/ 1) skills_changes.skillsData = /*skillsData*/ ctx[0];
    			skills.$set(skills_changes);
    			const tools_changes = {};
    			if (dirty & /*toolsData*/ 2) tools_changes.toolsData = /*toolsData*/ ctx[1];
    			tools.$set(tools_changes);
    			const trust_changes = {};
    			if (dirty & /*trustData*/ 4) trust_changes.trustData = /*trustData*/ ctx[2];
    			trust.$set(trust_changes);
    			const download_changes = {};
    			if (dirty & /*cvData*/ 8) download_changes.cvData = /*cvData*/ ctx[3];
    			download.$set(download_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skills.$$.fragment, local);
    			transition_in(tools.$$.fragment, local);
    			transition_in(trust.$$.fragment, local);
    			transition_in(download.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skills.$$.fragment, local);
    			transition_out(tools.$$.fragment, local);
    			transition_out(trust.$$.fragment, local);
    			transition_out(download.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(skills, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(tools, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(trust, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(download, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { skillsData } = $$props;
    	let { toolsData } = $$props;
    	let { trustData } = $$props;
    	let { cvData } = $$props;
    	const writable_props = ["skillsData", "toolsData", "trustData", "cvData"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home_container> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Home_container", $$slots, []);

    	$$self.$set = $$props => {
    		if ("skillsData" in $$props) $$invalidate(0, skillsData = $$props.skillsData);
    		if ("toolsData" in $$props) $$invalidate(1, toolsData = $$props.toolsData);
    		if ("trustData" in $$props) $$invalidate(2, trustData = $$props.trustData);
    		if ("cvData" in $$props) $$invalidate(3, cvData = $$props.cvData);
    	};

    	$$self.$capture_state = () => ({
    		Skills,
    		Tools,
    		Trust,
    		Download,
    		skillsData,
    		toolsData,
    		trustData,
    		cvData
    	});

    	$$self.$inject_state = $$props => {
    		if ("skillsData" in $$props) $$invalidate(0, skillsData = $$props.skillsData);
    		if ("toolsData" in $$props) $$invalidate(1, toolsData = $$props.toolsData);
    		if ("trustData" in $$props) $$invalidate(2, trustData = $$props.trustData);
    		if ("cvData" in $$props) $$invalidate(3, cvData = $$props.cvData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [skillsData, toolsData, trustData, cvData];
    }

    class Home_container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			skillsData: 0,
    			toolsData: 1,
    			trustData: 2,
    			cvData: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home_container",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*skillsData*/ ctx[0] === undefined && !("skillsData" in props)) {
    			console.warn("<Home_container> was created without expected prop 'skillsData'");
    		}

    		if (/*toolsData*/ ctx[1] === undefined && !("toolsData" in props)) {
    			console.warn("<Home_container> was created without expected prop 'toolsData'");
    		}

    		if (/*trustData*/ ctx[2] === undefined && !("trustData" in props)) {
    			console.warn("<Home_container> was created without expected prop 'trustData'");
    		}

    		if (/*cvData*/ ctx[3] === undefined && !("cvData" in props)) {
    			console.warn("<Home_container> was created without expected prop 'cvData'");
    		}
    	}

    	get skillsData() {
    		throw new Error("<Home_container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skillsData(value) {
    		throw new Error("<Home_container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toolsData() {
    		throw new Error("<Home_container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toolsData(value) {
    		throw new Error("<Home_container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trustData() {
    		throw new Error("<Home_container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trustData(value) {
    		throw new Error("<Home_container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cvData() {
    		throw new Error("<Home_container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cvData(value) {
    		throw new Error("<Home_container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/copyright/Copyright.svelte generated by Svelte v3.20.1 */

    const file$9 = "src/components/copyright/Copyright.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = `${/*TEXT*/ ctx[0]}`;
    			add_location(p, file$9, 6, 4, 123);
    			attr_dev(div, "classname", "copyright");
    			add_location(div, file$9, 5, 0, 91);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { copyrightData = {} } = $$props;
    	const { TEXT } = copyrightData;
    	const writable_props = ["copyrightData"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Copyright> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Copyright", $$slots, []);

    	$$self.$set = $$props => {
    		if ("copyrightData" in $$props) $$invalidate(1, copyrightData = $$props.copyrightData);
    	};

    	$$self.$capture_state = () => ({ copyrightData, TEXT });

    	$$self.$inject_state = $$props => {
    		if ("copyrightData" in $$props) $$invalidate(1, copyrightData = $$props.copyrightData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [TEXT, copyrightData];
    }

    class Copyright extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { copyrightData: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Copyright",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get copyrightData() {
    		throw new Error("<Copyright>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set copyrightData(value) {
    		throw new Error("<Copyright>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/containers/Footer_container.svelte generated by Svelte v3.20.1 */
    const file$a = "src/containers/Footer_container.svelte";

    function create_fragment$b(ctx) {
    	let footer;
    	let t;
    	let current;

    	const copyright = new Copyright({
    			props: { copyrightData: /*copyrightData*/ ctx[0] },
    			$$inline: true
    		});

    	const social = new Social({
    			props: { socialData: /*socialData*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			create_component(copyright.$$.fragment);
    			t = space();
    			create_component(social.$$.fragment);
    			add_location(footer, file$a, 9, 0, 212);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			mount_component(copyright, footer, null);
    			append_dev(footer, t);
    			mount_component(social, footer, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const copyright_changes = {};
    			if (dirty & /*copyrightData*/ 1) copyright_changes.copyrightData = /*copyrightData*/ ctx[0];
    			copyright.$set(copyright_changes);
    			const social_changes = {};
    			if (dirty & /*socialData*/ 2) social_changes.socialData = /*socialData*/ ctx[1];
    			social.$set(social_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(copyright.$$.fragment, local);
    			transition_in(social.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(copyright.$$.fragment, local);
    			transition_out(social.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			destroy_component(copyright);
    			destroy_component(social);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { copyrightData } = $$props;
    	let { socialData } = $$props;
    	const writable_props = ["copyrightData", "socialData"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer_container> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Footer_container", $$slots, []);

    	$$self.$set = $$props => {
    		if ("copyrightData" in $$props) $$invalidate(0, copyrightData = $$props.copyrightData);
    		if ("socialData" in $$props) $$invalidate(1, socialData = $$props.socialData);
    	};

    	$$self.$capture_state = () => ({
    		Copyright,
    		Social,
    		copyrightData,
    		socialData
    	});

    	$$self.$inject_state = $$props => {
    		if ("copyrightData" in $$props) $$invalidate(0, copyrightData = $$props.copyrightData);
    		if ("socialData" in $$props) $$invalidate(1, socialData = $$props.socialData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [copyrightData, socialData];
    }

    class Footer_container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { copyrightData: 0, socialData: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer_container",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*copyrightData*/ ctx[0] === undefined && !("copyrightData" in props)) {
    			console.warn("<Footer_container> was created without expected prop 'copyrightData'");
    		}

    		if (/*socialData*/ ctx[1] === undefined && !("socialData" in props)) {
    			console.warn("<Footer_container> was created without expected prop 'socialData'");
    		}
    	}

    	get copyrightData() {
    		throw new Error("<Footer_container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set copyrightData(value) {
    		throw new Error("<Footer_container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get socialData() {
    		throw new Error("<Footer_container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set socialData(value) {
    		throw new Error("<Footer_container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.20.1 */
    const file$b = "src/App.svelte";

    function create_fragment$c(ctx) {
    	let main;
    	let t0;
    	let t1;
    	let current;

    	const header_container = new Header_container({
    			props: {
    				headingProfilData: MOCK_DATA.PROFIL_DATA,
    				socialData: MOCK_DATA.SOCIAL_DATA
    			},
    			$$inline: true
    		});

    	const home_container = new Home_container({
    			props: {
    				skillsData: MOCK_DATA.SKILLS_DATA,
    				toolsData: MOCK_DATA.TOOLS_DATA,
    				trustData: MOCK_DATA.TRUST_DATA,
    				cvData: MOCK_DATA.CV_DATA
    			},
    			$$inline: true
    		});

    	const footer_container = new Footer_container({
    			props: {
    				copyrightData: MOCK_DATA.COPYRIGHT_DATA,
    				socialData: MOCK_DATA.SOCIAL_DATA
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header_container.$$.fragment);
    			t0 = space();
    			create_component(home_container.$$.fragment);
    			t1 = space();
    			create_component(footer_container.$$.fragment);
    			add_location(main, file$b, 8, 0, 270);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header_container, main, null);
    			append_dev(main, t0);
    			mount_component(home_container, main, null);
    			append_dev(main, t1);
    			mount_component(footer_container, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_container.$$.fragment, local);
    			transition_in(home_container.$$.fragment, local);
    			transition_in(footer_container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_container.$$.fragment, local);
    			transition_out(home_container.$$.fragment, local);
    			transition_out(footer_container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header_container);
    			destroy_component(home_container);
    			destroy_component(footer_container);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		DATA: MOCK_DATA,
    		Header_container,
    		Home_container,
    		Footer_container
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    var app = new App({
      target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
