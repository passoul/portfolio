
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value' || descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.21.0' }, detail)));
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

    var THEMESWITCH_DATA = {
      TEXTDARK: "go dark",
      TEXTLIGHT: "go light"
    };
    var NAVBAR_DATA = [{
      id: 1,
      url: "#skills",
      label: "skills",
      icon: "bar-chart"
    }, {
      id: 2,
      url: "#tools",
      label: "tools",
      icon: "wrench"
    }, {
      id: 3,
      url: "#trust",
      label: "trust",
      icon: "handshake-o"
    }, {
      id: 4,
      url: "#cv",
      label: "cv",
      icon: "file-pdf-o"
    }];
    var PROFIL_DATA = {
      AVATAR: {
        alt: "ceci est ma photo",
        src: "./static/media/avatar/avatar.png"
      },
      PROFESSION: "front end developer",
      FIRSTNAME: "pascal",
      LASTNAME: "soulier"
    };
    var SKILLS_DATA = {
      TITLE: "skills",
      LISTS: [{
        cat_title: "programming languages",
        cat_items: [{
          name: "html",
          level: 80
        }, {
          name: "css",
          level: 75
        }, {
          name: "javascript",
          level: 65
        }, {
          name: "accessibility",
          level: 60
        }]
      }, {
        cat_title: "frameworks and library",
        cat_items: [{
          name: "sass",
          level: 70
        }, {
          name: "less",
          level: 65
        }, {
          name: "jquery",
          level: 75
        }, {
          name: "vue",
          level: 50
        }, {
          name: "angular",
          level: 55
        }, {
          name: "react",
          level: 45
        }, {
          name: "svelte",
          level: 65
        }]
      }]
    };
    var TOOLS_DATA = {
      TITLE: "tools",
      LISTS: ["git", "grunt", "brunch", "bower", "gulp", "webpack", "middleman", "photoshop", "fireworks", "illustrator", "indesign", "dreamweaver", "figma", "prestashop", "wordpress", "drupal", "sublime text", "notepad++", "coda", "visual studio code"]
    };
    var TRUST_DATA = {
      TITLE: "they trusted me",
      COMPANIES: [{
        name: "lwm",
        logo: "path",
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125 46" width="200px" height="50px"><path class="filled" d="M0 46h125V0H0v46zm38.8-35l5.4 16.9L49.9 11h5.2l5.5 17 5.6-17h5.3l-7.9 24h-6l-5.3-16.3L46.9 35h-6L33 11h5.8zm68.8 24l-5.4-16.9L96.4 35h-5.2l-5.5-17-5.6 17h-5.3l7.9-24h6L94 27.3 99.5 11h6l7.9 24h-5.8zM12 11h6v19h12v5H12V11z"></path></svg>'
      }, {
        name: "pmu",
        logo: "path",
        svg: '<svg id="PMU_DISPATCH" viewBox="0 0 283.6 181.5" width="200px" height="50px"><rect x="56.7" y="0" fill="#FFFFFF" width="226.8" height="124.7"></rect><g fill="#B9001E"><path d="M253.1,60.6c0,7.2-2,14-5.4,19.7c-7,13.2-21.9,21.7-38.6,21.7h6.5c10.7,0,22-4.9,30-13.5 c6.4-6.9,10.7-15.9,10.7-26.3c0-18.9-13-33.3-28.9-37.6C241.7,30.2,253.1,44.3,253.1,60.6z"></path><path d="M87.1,64.2c0-7.2,2-14,5.4-19.7c7-13.2,21.9-21.7,38.6-21.7h-6.5c-10.7,0-22,4.9-30,13.5 c-6.4,6.9-10.7,15.9-10.7,26.3c0,18.9,13,33.3,28.9,37.6C98.5,94.6,87.1,80.5,87.1,64.2z"></path></g><path fill="#00692D" d="M133,102.1c-23,0-44.6-18.5-44.6-40.8c0-22.3,19.7-38.6,42.8-38.6h76.1c23,0,44.6,18.5,44.6,40.8 c0,22.3-19.7,38.6-42.8,38.6H133z"></path><path fill="#B9001E" d="M232.3,82.5c-0.2-0.2-1.6-1.3-1.6-1.3c0-0.3-0.2-0.4-0.3-0.4c-0.1-0.1-0.8-0.3-1-0.5 c-1.2-1.5-2-1.6-2-1.6l-0.1-0.2c-0.6-0.7-1.7-1.2-1.7-1.2c-0.1-0.5-1.8-1.6-2.4-2.1c-0.7-0.5-0.8-0.6-1.2-1 c-0.4-0.4-1.4-1.7-2.7-2.9c-0.4-0.4-1-0.6-1-0.6s-0.4-0.3-0.9-0.9c-0.5-0.6-4.5-5.7-4.5-5.7c0.5-1.2-0.4-2.2-0.5-2.3  c0.4-1.7-0.6-3.8-0.6-3.8c0-1,1.5-2.5,3-4.3c1.5-1.9,2.7-3.8,2.9-4c0.3-0.4,1.4-0.5,1.4-0.5c0.7,0.7,1.4,1,1.8,1.1 c0.4,0.1,1.6,0.2,1.6,0.2s0.4,0.4,0.7,0.6l0.3,0.2l-5.3-0.3l-0.4,0.7l1.9,0c0,0,3.8,0.2,4,0.2c0.2,0,0.8,0.1,0.8,0.1  c0.2,0.2,0.7,0.4,0.7,0.4c-0.1,0.2-0.1,0.6,0.2,0.8c0.3,0.2,0.6,0.2,0.7,0.1c0.1,0,0.1,0,0.2,0.2c0.1,0.2,0.3,0.2,0.4,0.2 c0.1,0,0.1-0.2,0.1-0.3c0-0.2-0.3-0.8-0.3-0.9c-0.3-0.6,0.1-0.9,0.4-0.2c0.1,0.3,0.5,0.6,0.5,0.9c0,0.2,0,0.3,0.3,0.4 c0.3,0.1,0.4-0.1,0.5-0.1c0.1,0,0.2-0.2,0.3-0.3c0.1-0.1,0.3-0.1,0.3-0.3c0-0.3,0.5-0.7,0.4-0.9c-0.1-0.2,0-0.7,0-0.9 c0-0.2,0.1-0.4,0-0.7c-0.2-0.3-0.6-0.6-0.6-0.6s-0.4-0.8-0.9-1.4c-0.5-0.6-0.7-1.1-1-1.7c-0.3-0.6-0.9-1.2-1.5-2 c-0.6-0.8-0.5-1-0.5-1.5c0-0.3-0.2-0.5-0.3-0.6c-0.6-0.5-1.3-1.2-1.3-1.2c-0.4-0.4-0.7-0.9-1.6-1.5 c-0.3-1-1.3-1.7-1.3-1.7c-0.1-0.6-0.3-0.6-0.3-0.6c-0.1,0.4,0.2,1.6,0.2,1.6l-0.9-0.9c-0.3-1.3-0.4-1.2-0.4-1.2l-0.1,0.1 c-0.1,0.1-0.1,0.3-0.1,0.3s0,0.6-0.1,1c0,0.4,0.4,1.3,0.4,1.3L218,40c-1.1-0.7-1.5,0.3-1.5,0.3l-0.4,0.2 c-0.8-0.3-1.1,0.6-1.1,0.6s-0.3-0.1-0.7,0c-0.3,0.1-0.4,0.4-0.4,0.4l-1,0c1.7,1.2,3.4,2.8,3.8,2.8c0.7,0.1,0.8,0.4,0.6,1  c-0.2,0.6,0.3,1.2,0.2,1.4c-0.3,0.5-0.5,0.8-0.7,1.1c-0.2,0.2-0.2,0.4-0.5,0.3c0.1,0.2,0,0.8-0.5,0.7 c-0.5-0.1-0.7,0.1-0.7,0.1c-0.7,0.3-1.1,0-1.2-0.3c-0.2-0.3-0.5-0.8-1.1-0.9c-0.6,0-1.6-0.2-3.5-0.7 c-2.2,0.6-4.9-0.6-4.9-0.6l-6.8,6.5c0.3,1.3,0.2,2.3-1,4.3c0.8,2-0.2,2.7-0.2,2.7s2.2,1,3,1.5c0.7,0.5,3.8,1.2,4.3,1.6 c0.4,0.4,1.2,1.2,1.2,2.1c0.1,0.9-0.2,1.2-0.6,1.8c-0.3,0.7-0.7,0.8-0.7,0.8s-2.1,3.4-2.3,4.6c-0.1,0.4-0.2,0.6-0.3,0.8 c0,0.5,0,0.9,0,1.3c0.1,1,0.3,1.9,0.2,2.2c-0.3,0.7-0.5,0.8-0.5,0.8l-3.4,0.5c-0.1-0.1-0.7-0.3-1.1-0.2 c-0.4,0-0.6,0.5-0.8,0.6c-0.2,0.1-0.6-0.2-0.7-0.3c-0.1-0.1-0.4-0.2-0.4-0.2s-0.2-0.7-0.3-0.9c0-0.2-0.2-0.1-0.2-0.1 s-0.2,0.1-0.3,0.1c-0.1,0.1-1.2,0.4-1.3,0.4c-0.2,0-0.8,0.3-1.1,0.4c-0.3,0.1-0.2,0.2-0.2,0.2L191,78  c0.1,0.1,1.4,0.8,1.4,0.8c0,0.5,0.5,0.5,0.6,0.5c0.1,0,0.5-0.1,0.5-0.1c0.5,0.5,1.7,0.7,1.7,0.7s0.3,0.3,0.5,0.3 c0.2,0,0.6-0.1,0.7-0.2c0.1-0.1,0.6-0.2,0.6-0.2s4.7-0.8,5.2-0.8c0.3,0,0.5,0,0.5,0s0.9-1.6,0.9-2.1c0-0.6,0-1,0-1.5  c0.1-0.8,1.2-3.4,1.5-5.5c0.1-1.1,1-2.9,1.5-3.8c0.4,0.1,0.7,0.2,1,0.3c0.9,0.9,2.2,1.1,2.2,1.1s0.9,0.5,1.2,0.9 c0.3,0.4,1.3,1,1.8,1.3c0.3,0.2,2.1,1.3,2.8,1.7c0.5,0.2,0.5,0.3,0.6,0.4c0.6,0.6,2.5,2,2.6,2.1c0.1,0.1,0.6,0.3,0.9,0.3 c0.3,0,0.6,0.3,1.3,0.8c0.7,0.5,2.6,2.3,3,2.7c0.4,0.4,0.8,1,0.9,1.2c0.1,0.2,0.1,0.6,0.4,0.9c0.4,0.4,0.7,0.2,0.9,0.2 c0.1,0,0.4-0.1,0.9,0.1c0.4,0.2,0.8,0.6,0.9,0.8c0.1,0.2,0.3,1,0.5,1.3c0.2,0.3,0.3,0.4,0.5,0.3c0.2,0,0.2,0.1,0.2,0.1 s0.1,0.5,0.1,0.7c0,0.2,0.1,0.1,0.1,0.1s0.2,0,0.2,0c0,0,2.8-0.8,2.9-0.8c0.1,0,0.2,0,0.2-0.1 C232.4,82.6,232.3,82.5,232.3,82.5z"></path><g fill="#FFFFFF"><path d="M217.4,45.2c0.2-0.6,0-0.8-0.6-1c-0.7-0.1-4.6-3.8-6.4-4.4c-0.2-0.1,0.2-0.6-1.3-0.9 c-0.9-0.2-1-0.5-1.5-0.9c-0.5-0.3-1.2-0.8-1.9-0.7c-0.4-0.6-1-0.9-1.5-1.3c-0.5-0.4-1-0.9-1-1.1c-0.2,0.1,0.2,1.8,0.2,1.8 s-0.9-0.8-1.6-1.1c-0.6-0.3-0.6-1-0.8-1.1c-0.2,0.1,0.5,2.5,0.5,2.5s0.8,0.3,0.8,0.6c-0.6,0.1-1.9,0.7-1.9,0.7 c-0.1,0-0.1,0-0.1,0.1c0,0-0.7,0-0.7,0c-1.4,0-1-0.5-3.6-0.3c-1.3,0.1-2.8-0.1-2.8-0.1s1.8,1.6,3.5,1.6 c0,0-1.3,0.3-3.3,0.1c-4.4-0.4-5.5,1.6-5.5,1.6s1.8-0.4,2.8-0.2c1.8,0.4,1.7,0.7,1.8,0.8c0,0-1.4-0.5-2.7-0.1 c-4,1-4.5,1.2-5.5,1.7c-1.9,0.9-2.3,1.5-2.2,1.7c1.8-0.4,3.8,0.2,4.2,0.8c-0.1,0.3-0.3,0.2-0.3,0.5 c0.3,0.4,0.4,1.2,0.5,1.5c-0.1,0.2-0.2,0.4-0.1,0.6c0.3,0.2,0.7,0.7,1,1c0,0.1,0,0.2-0.1,0.3c-0.1,0.1-0.4,0.1-0.4,0.2 c0,0.1,0.1,0.3,0.2,0.4c0,0.1,0,0.2,0,0.2c-0.2,0.1-0.5,0.2-0.7,0.3c0,0.5,0.6,0.4,0.6,0.5c0.1,0.1,0.1,0.3,0,0.4 c0,0-0.2,0-0.2,0.1c-0.1,0.2,0.2,0.6,0,0.9c-0.1,0.1-0.9,0.1-1.2,0.1c-0.3,0.2-0.7,0.6-0.9,1c0.2,0.1,0.7,0.6,0.8,0.8 c0.1,0.1,0.1,0.3,0.2,0.5c1.2,1.1,1.9,1.3,2.5,1.5c0.6,0.3,1,0.6,1.4,0.8c0.1-0.1,0.3-0.4,0.6-0.5c0.2-0.1,2.9-2.6,3-2.8 c0.1,0,0.2,0.1,0.2,0.1s0.3-0.4,0.3-0.5c0.1-0.8,0.1-1.3,0.2-1.6c0.1-0.2,0.5-0.8,0.8-1.3c0.1-0.1,0.1-0.1,0.2-0.2 c0.2-0.5,0.8-2,0.8-2.2c0.3,0,1.9-0.2,2.2-0.4c-0.1,0.2-0.9,2.2-1.3,2.5c0,0-0.1,0.1-0.1,0.3c0.1,0.1,0.1,0.3,0.1,0.3 c0,0.2-0.2,0.4-0.4,0.6c0,0,0.2,0.1,0.2,0.2c0,0.1,0,0.5,0,0.6c0,0-0.1,0.1-0.1,0.2c0,0,0.1,0.1,0.1,0.2 c0,0.2,0,0.4,0,0.4c0,0-0.1,0.2-0.1,0.3c0,0.2,0,0.5-0.1,0.6c-0.1,0.3-0.9,1-1.3,1.1c-0.1,0.1-0.5,0.6-0.5,0.6 s0.3,0.7,0.1,0.8c-1.1,1.8-3.4,3.9-4.3,4.6c-0.5,0.4-3.2-0.7-5.5-1c-1.4,1.4-3.4,2.5-5.9,3.3c0,0,0,0-0.1,0  c0,0,1.1,0.1,2.8-0.2l3.4,4.1c0.6,1.1,2.8,4.2,2.8,4.2s-0.5,1-0.5,1.2c-0.9,0.4-3.8,2.5-3.8,2.5s-1-0.2-1.7,0.6 c-0.4,0.4-0.8,0-0.8,0s-0.7-0.7-1.1-0.7c-0.4,0-0.7-0.2-0.7-0.2l-2.4,1.9c0,0-0.2,0.3,0.1,0.3c0.4,0.1,1.9,0.5,1.9,0.5  s0.6,0.3,1.1,0c0.6,0.1,2.4,0,3.2-0.3c0.8-0.3,4.9-2.9,4.9-2.9l0.6-0.1c0,0,1.8-1.2,1.9-1.7c0.2-0.4-0.1-1.2-0.1-1.2 s-1.4-2.5-1.6-3.3c-0.2-0.8-1.4-5.1-1.4-5.1l1.5,0.4c0,0,1.3,2,3.7,1.1c0.9,0.1,2.3,0.4,4,0.7c2.6,0.4,5.1,0.7,5.2,0.7 c0.2,0.4,0.3,0.6,0.3,0.6l-2.2,3.8c0,0-1,0.6-0.9,2.1c0,0.1-0.7,0.7-0.7,0.7s-0.3-0.1-0.5-0.1c-0.3,0-0.5,0.3-0.5,0.3 l-0.9-0.3l-2,2c0,0-0.1,0.1,0.1,0.2c0.2,0,1.7,0.2,2,0.3c0.4,0.1,0.6-0.2,0.7-0.3c0.1-0.1,0.5,0,0.8-0.2 c0.3-0.1,1.4-1,1.6-1.1c0.2-0.1,1.2-0.5,1.4-1.7c0.2-1.2,2.3-4.6,2.3-4.6s0.4-0.2,0.7-0.8c0.3-0.7,0.6-1,0.6-1.8 c0-0.9-0.8-1.6-1.2-2.1c-0.4-0.4-3.5-1.2-4.3-1.6c-0.7-0.5-3-1.5-3-1.5s1-0.7,0.2-2.7c1.2-2,1.2-3,1-4.3l6.8-6.5 c0,0,2.8,1.2,4.9,0.6c1.9,0.6,2.9,0.7,3.5,0.7c0.6,0,0.9,0.6,1.1,0.9c0.2,0.3,0.5,0.7,1.2,0.3c0,0,0.3-0.2,0.7-0.1 c0.4,0.1,0.5-0.5,0.5-0.7c0.3,0.1,0.3-0.1,0.5-0.3c0.2-0.2,0.5-0.6,0.7-1.1C217.8,46.5,217.3,45.9,217.4,45.2"></path> <path d="M124.1,53c-0.3,0-19.2,0-19.2,0c-0.1,0.8,0.1,1.4,1.6,1.8c1.2,0.3,3.5,0.9,3.6,0.9 c-4.5,16.6-5.4,20.2-5.8,21.3c0,0,0.2,0,1.4,0c2.7,0,4.2-1.3,4.6-3.1c0.4-1.6,1.5-5.6,1.5-5.6h8.1 c4.9,0,8.3-5.3,8.3-10.3C128.5,53.6,126.3,53,124.1,53 M121.2,64c-0.4,0.4-1,0.4-1,0.4H113l1.9-7.2h7.1c0,0,0.8,0,1,1  C123.3,60.2,122.7,62.5,121.2,64z"></path><path d="M132.7,53c0,0,0.1,0,1.1,0c1.9,0,3,0.7,3.5,2.2 c0.4,1.2,3.9,13.1,3.9,13.1s10.7-13.3,11.2-13.9c0.8-1,2.4-1.4,4.6-1.4h1.4c-0.6,2.4-5.6,20.6-5.7,21 c-0.5,1.8-1.6,3-4.4,3c-0.8,0-1.5,0-1.5,0c0.2-0.6,3.7-13.7,3.7-13.7s-7.6,9.6-8.5,10.6c-0.5,0.6-1,0.8-1.9,0.8 c-0.3,0-0.8,0-1.3,0c-0.8,0-1.1-0.1-1.4-1c-0.3-1-3-10.4-3-10.4s-0.3,1.6-0.8,3.2c-1,3.6-1.6,6-2,7.3 c-0.5,1.8-1.7,3.1-4.3,3.1c-1.2,0-1.4,0-1.4,0L132.7,53z"></path><path d="M179.7,53h1.3c-1,3.9-2.8,10.4-4.8,17.5 c-1.2,4.3-5.1,6.6-11.6,6.6c-5.9,0-8.7-3.4-7.7-7c0.9-3.2,3.4-12.7,3.8-14c0.5-1.8,1.9-3,4.6-3h1.5L162,70.5 c0,0.1-0.3,0.9,0.5,1.4c0.7,0.4,1.8,0.9,3.4,0.9c2.2,0,3.7-0.6,4.4-1c0.5-0.3,0.7-0.9,0.8-1.1c0.8-2.9,3.7-13.2,4.1-14.6 C175.6,54.2,177,53,179.7,53z"></path></g><polygon fill="#00A01E" points="283.5,124.8 56.7,124.8 56.7,0 0,56.7 0,181.5 226.8,181.5"></polygon></svg>'
      }, {
        name: "société générale",
        logo: "path",
        svg: '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="50" viewBox="0 0 340 70"><g fill="none" fill-rule="evenodd" transform="translate(-15 -1)"><path fill="#000" d="M15.106 24.88c0-5.948 4.551-10.164 10.751-10.164 3.602 0 6.506 1.312 8.405 3.685l-3.518 3.184c-1.229-1.48-2.737-2.29-4.608-2.29-3.212 0-5.445 2.234-5.445 5.585s2.233 5.585 5.445 5.585c1.871 0 3.38-.81 4.608-2.29l3.518 3.183c-1.899 2.374-4.803 3.686-8.405 3.686-6.2 0-10.75-4.216-10.75-10.164M41.748 16.81c0 .782-.112 1.396-.894 3.212l-1.787 4.076h-3.323l1.313-4.551c-1.006-.475-1.648-1.424-1.648-2.737 0-1.9 1.34-3.127 3.183-3.127 1.815 0 3.156 1.228 3.156 3.127M60.04 30.381v4.273H44.345V15.106h15.33v4.274h-9.858v3.294h8.686v4.134h-8.685v3.573zM61.604 32.895l1.815-4.077c1.731 1.144 4.188 1.926 6.45 1.926 2.29 0 3.184-.642 3.184-1.591 0-3.1-11.114-.838-11.114-8.098 0-3.491 2.848-6.34 8.656-6.34 2.541 0 5.166.587 7.093 1.704l-1.703 4.105c-1.87-1.005-3.714-1.507-5.418-1.507-2.318 0-3.155.78-3.155 1.759 0 2.987 11.086.753 11.086 7.958 0 3.407-2.848 6.31-8.657 6.31-3.21 0-6.394-.865-8.237-2.15M85.62 19.49h-6.003v-4.384h17.508v4.385H91.15v15.163h-5.53zM126.308 15.106l-8.379 19.547h-5.445l-8.35-19.547h5.977l5.306 12.734 5.416-12.734zM141.64 24.88c0-3.379-2.318-5.585-5.28-5.585-2.958 0-5.276 2.206-5.276 5.585s2.318 5.585 5.277 5.585c2.96 0 5.279-2.206 5.279-5.585m-16.141 0c0-5.864 4.608-10.164 10.862-10.164 6.256 0 10.864 4.3 10.864 10.164s-4.608 10.164-10.864 10.164c-6.254 0-10.862-4.3-10.862-10.164M150.382 25.942V15.107h5.53v10.666c0 3.352 1.396 4.692 3.713 4.692 2.29 0 3.687-1.34 3.687-4.692V15.107h5.445v10.835c0 5.835-3.407 9.102-9.188 9.102-5.78 0-9.187-3.266-9.187-9.102M170.991 32.895l1.815-4.077c1.731 1.144 4.19 1.926 6.451 1.926 2.29 0 3.183-.642 3.183-1.591 0-3.1-11.114-.838-11.114-8.098 0-3.491 2.848-6.34 8.657-6.34 2.541 0 5.166.587 7.094 1.704l-1.704 4.105c-1.872-1.005-3.715-1.507-5.419-1.507-2.317 0-3.155.78-3.155 1.759 0 2.987 11.087.753 11.087 7.958 0 3.407-2.849 6.31-8.658 6.31-3.21 0-6.394-.865-8.237-2.15M58.002 39.648h5.529V54.81h9.326v4.385H58.002zM78.136 41.352c0 .781-.112 1.396-.894 3.211l-1.787 4.077h-3.323l1.312-4.552c-1.005-.475-1.647-1.424-1.647-2.736 0-1.9 1.34-3.128 3.183-3.128 1.815 0 3.156 1.228 3.156 3.128M90.59 51.32l-2.512-6.255-2.513 6.255h5.026zm1.62 4.077h-8.265l-1.536 3.8h-5.641l8.629-19.55h5.445l8.657 19.55h-5.752l-1.537-3.8zM117.455 39.648l-8.377 19.548h-5.445l-8.35-19.548h5.976l5.306 12.734 5.417-12.734zM135.133 54.923v4.273H119.44V39.648h15.331v4.273h-9.858v3.295h8.685v4.133h-8.685v3.574zM156.665 39.648v19.548h-4.553l-8.629-10.417v10.417h-5.416V39.648h4.551l8.63 10.416V39.648z"></path><path fill="#000" d="M160.436 59.196h5.528V39.648h-5.528zM178.363 44.004h-3.072v5.725h3.072c2.29 0 3.435-1.061 3.435-2.849 0-1.815-1.145-2.876-3.435-2.876zm-.055 9.997h-3.017v5.195h-5.529V39.648h8.936c5.333 0 8.686 2.765 8.686 7.232 0 2.876-1.398 4.998-3.827 6.171l4.218 6.145h-5.922l-3.545-5.195zM249.497 25.422c-1.623-.688-3.361-1.138-4.91-1.138-2.257 0-3.387.486-3.387 1.358 0 2.498 10.082.493 10.082 5.821 0 2.206-2.071 3.911-6.219 3.911-2.462 0-4.385-.509-6.595-1.705l.912-1.986c1.937 1.076 3.743 1.553 5.697 1.553 2.46 0 3.778-.71 3.778-1.773 0-2.731-10.084-.692-10.084-5.687 0-2.153 2.054-3.636 5.771-3.636 2.223 0 4.093.489 5.879 1.384l-.924 1.898zM260.738 35.441c-4.028 0-7.367-2.682-7.367-6.692 0-3.962 3.34-6.695 7.367-6.695 4.05 0 7.336 2.733 7.336 6.695 0 4.01-3.287 6.692-7.336 6.692m0-11.229c-2.935 0-4.937 1.987-4.937 4.537 0 2.611 1.916 4.554 4.937 4.554 3 0 4.907-1.962 4.907-4.554 0-2.55-1.908-4.537-4.907-4.537M277.694 35.426c-4.23 0-7.419-2.68-7.419-6.695 0-3.945 3.238-6.677 7.42-6.677 2.494 0 4.28.707 5.883 1.887l-1.247 1.857c-1.166-.897-2.625-1.551-4.569-1.551-3.088 0-5.006 1.952-5.006 4.484 0 2.61 1.937 4.504 5.038 4.504 1.941 0 3.476-.628 4.635-1.521l1.253 1.856c-1.607 1.18-3.493 1.856-5.988 1.856M286.238 35.086h2.349V22.441h-2.349zM292.057 22.44v12.646h11.918v-2.09H294.4V29.69h7.127v-2.088H294.4V24.53h9.168v-2.09zM305.224 22.44v2.077h5.156v10.569h2.34V24.517h5.151v-2.076zM319.758 22.44v12.646h11.919v-2.09h-9.571V29.69h7.13v-2.088h-7.13V24.53h9.168v-2.09zM245.698 50.05c1.287 0 2.61-.29 3.607-.761v-3.677h2.282v4.909c-1.605 1.079-3.81 1.736-5.989 1.736-4.227 0-7.416-2.676-7.416-6.692 0-3.944 3.238-6.672 7.416-6.672 2.447 0 4.284.688 5.888 1.868l-1.245 1.855c-1.17-.893-2.635-1.502-4.578-1.502-3.084-.067-5 1.922-5 4.45 0 2.617 1.94 4.487 5.035 4.487M254.673 39.278v12.639h11.919V49.83h-9.578v-3.307h7.136v-2.087h-7.136v-3.072h9.177v-2.086zM271.19 51.918h-2.294V39.277h2.393l8.245 9.527.056-.016a101.83 101.83 0 0 1-.157-6.208v-3.303h2.291v12.64h-2.374l-8.213-9.522-.037.019c.09 1.87.09 5.139.09 6.205v3.299zM285.024 39.278v12.639h11.921V49.83h-9.58v-3.307h7.133v-2.087h-7.133v-3.072h9.173v-2.086zM305.544 47.268h-3.777v4.65h-2.345v-12.64h8.125c2.695 0 4.366 1.655 4.366 4.029 0 2.258-1.64 3.605-3.624 3.894l3.764 4.717h-2.94l-3.57-4.65zm1.752-2.107c1.467 0 2.296-.758 2.296-1.854 0-1.2-.73-1.943-2.045-1.943h-5.78v3.797h5.529zM319.03 39.278l-6.16 12.639h2.536l1.451-3.068h6.82l1.454 3.068h2.527l-6.164-12.64h-2.464zm1.245 2.393l2.426 5.126h-4.869l2.443-5.126zM329.384 39.278v12.639h10.783V49.83h-8.443V39.278zM341.75 39.278v12.639h11.922V49.83h-9.575v-3.307h7.132v-2.087h-7.132v-3.072h9.175v-2.086z"></path><path fill="#ED0210" d="M199.175 37.453h30.212V22.042h-30.212z"></path><path fill="#000" d="M199.175 52.255h30.212V37.151h-30.212z"></path><path fill="#FFF" d="M204.454 38.069h19.655v-1.838h-19.655z"></path></g></svg>'
      }, {
        name: "emagine",
        logo: "path",
        svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200px" height="50px" viewBox="0 0 278 65" version="1.1"><title>logo@3x</title><desc>Created with Sketch.</desc><defs/><g id="Elements" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M194.373688,14.9409591 L180.742638,14.9409591 L180.742638,20.7374674 L183.407389,20.8759055 C184.853248,20.8759055 185.309983,21.3646769 185.309983,22.900681 L185.309983,42.3093306 C185.309983,43.9856563 184.472169,44.4047378 183.099164,44.5441176 L180.589459,44.7522457 L180.589459,50.0590409 L198.714066,50.0590409 L198.714066,44.4734859 L194.373688,44.2634744 L194.373688,14.9409591 Z M124.859444,38.9585627 C124.859444,41.9599391 121.967726,45.032889 117.241598,45.032889 C110.841711,45.032889 109.320197,39.5160823 109.320197,33.719574 C109.320197,26.1817589 111.760784,19.9661692 118.996617,19.9661692 C121.355011,19.9661692 123.718075,20.3852507 124.859444,20.8759055 L124.859444,38.9585627 Z M133.696182,42.3093306 L133.696182,16.3366416 C128.211632,14.4503043 122.651427,13.8927847 120.137052,13.8927847 C106.424743,13.8927847 100.029526,21.7140684 100.029526,34.0002173 C100.029526,43.9847146 104.521215,50.9678354 115.262415,50.9678354 C119.450549,50.9678354 123.336061,49.0805564 125.696323,45.9398001 L125.92796,46.00949 L125.92796,50.0590409 L138.036561,50.0590409 L138.036561,44.4734859 L135.600644,44.3341061 C134.151049,44.2634744 133.696182,43.8462764 133.696182,42.3093306 L133.696182,42.3093306 Z M165.373382,35.8178064 C165.373382,40.0745436 161.871751,42.6596639 157.601423,42.6596639 C150.521571,42.6596639 149.680956,36.3734425 149.680956,31.6269922 C149.680956,24.5760649 152.956555,19.9689945 159.280786,19.9689945 C161.41128,19.9689945 163.619297,20.2468125 165.373382,20.8052738 L165.373382,35.8178064 Z M174.209186,16.4769632 C169.715629,14.7309476 163.77341,13.8927847 160.114864,13.8927847 C148.614308,13.8927847 140.312761,19.8277311 140.312761,32.465155 C140.312761,40.4258186 144.124486,48.8008548 155.243029,48.8008548 C158.975363,48.8008548 162.783352,47.6867575 165.373382,44.8944509 L165.373382,48.7349319 C165.373382,54.5983048 163.544576,58.9963054 156.537577,58.9963054 C154.252971,58.9963054 152.575476,58.7872356 151.129617,58.2984642 C149.759413,57.8096928 149.375532,57.1137351 149.375532,55.7858592 L149.375532,52.4332078 L142.14437,52.9935526 L142.14437,62.6964648 C145.338709,64.1637207 151.661073,65 156.462856,65 C167.886823,65 173.144406,60.2544915 174.057875,49.9902927 C174.289512,47.4767459 174.209186,44.8219357 174.209186,42.3809041 L174.209186,16.4769632 Z M239.996701,26.0414373 C239.996701,17.8048392 235.505945,13.89561 227.887165,13.89561 C222.861218,13.89561 218.217283,15.9891336 215.548796,19.4783396 L215.548796,14.9381339 L202.675234,14.9381339 L202.675234,20.5265141 L205.876112,20.7365256 C207.245381,20.8062156 207.780573,21.3656187 207.780573,22.8997392 L207.780573,42.2386989 C207.780573,43.9847146 207.018415,44.403796 205.570688,44.5412924 L203.057247,44.751304 L203.057247,50.0580991 L221.184657,50.0580991 L221.184657,44.4744277 L216.841476,44.2644161 L216.841476,27.3683715 C216.841476,23.7379021 219.663142,20.3174442 224.690958,20.3174442 C229.870084,20.3174442 230.932996,23.2491307 230.932996,27.8571429 L230.932996,42.2386989 C230.932996,43.9847146 230.17364,44.403796 228.726847,44.5412924 L226.210604,44.751304 L226.210604,50.0580991 L244.340816,50.0580991 L244.340816,44.4744277 L239.996701,44.2644161 L239.996701,26.0414373 Z M264.899472,20.3353376 C267.638011,20.3353376 269.467751,21.6632136 269.467751,24.2455085 C269.467751,29.6219936 261.470694,30.809548 255.832031,30.8792379 C256.0618,25.7118227 258.805943,20.3353376 264.899472,20.3353376 L264.899472,20.3353376 Z M275.104546,41.9100261 C273.274806,43.0956969 270.002009,44.9820342 265.505649,44.9820342 C259.031041,44.9820342 256.441011,41.2818748 256.139323,36.7454361 C265.127372,36.6738626 277.847755,34.8590988 277.847755,24.1051869 C277.847755,17.8933642 272.894661,14.4022747 265.432796,14.4022747 C252.937512,14.4022747 246.617016,23.4779774 246.617016,33.8118661 C246.617016,44.2154448 251.644831,51.4763837 264.594983,51.4763837 C271.753292,51.4763837 276.778305,48.5418719 278,47.5652709 L275.104546,41.9100261 Z M93.1803762,26.0414373 C93.1803762,17.8029557 88.9156529,13.8937265 81.7592117,13.8937265 C76.72766,13.8937265 72.8449498,15.9881918 70.1792641,19.4792814 C68.4289156,15.7084903 64.9216803,13.8937265 60.0470436,13.8937265 C55.020162,13.8937265 51.1374517,15.9881918 48.4689641,19.4792814 L48.4689641,14.9409591 L35.5982045,14.9409591 L35.5982045,20.596204 L38.7990821,20.8052738 C40.2412049,20.8759055 40.7007415,21.4334251 40.7007415,22.9684874 L40.7007415,42.2386989 L40.6250861,42.2386989 C40.6250861,43.9856563 39.8647959,44.4047378 38.418003,44.5441176 L35.9036282,44.7522457 L35.9036282,50.0590409 L53.8778587,50.0590409 L53.8778587,44.4734859 L49.7625782,44.2634744 L49.7625782,27.3693132 C49.7625782,23.7369603 51.8220865,20.3155607 57.1515897,20.3155607 C62.0271604,20.3155607 62.4091735,23.5975804 62.4091735,27.8562011 L62.4091735,42.2386989 C62.4091735,43.9856563 61.6460813,44.4047378 60.1983544,44.5441176 L57.6849136,44.7522457 L57.6849136,50.0590409 L75.6610122,50.0590409 L75.6610122,44.4734859 L71.4700762,44.2634744 L71.4700762,27.5086931 C71.4700762,23.3875688 73.7593528,20.3155607 78.8590877,20.3155607 C83.7346584,20.3155607 84.1166715,23.5975804 84.1166715,27.8562011 L84.1166715,42.3093306 C84.0410161,43.9856563 83.280726,44.4047378 81.9086544,44.5441176 L79.3933456,44.7522457 L79.3933456,50.0590409 L97.5254251,50.0590409 L97.5254251,44.4734859 L93.1803762,44.2634744 L93.1803762,26.0414373 Z M188.967595,10.332947 C192.393571,10.332947 194.83229,8.16690814 194.83229,5.23616343 C194.83229,2.30447696 192.393571,-2.13162821e-14 189.042316,-2.13162821e-14 C185.46503,-2.13162821e-14 183.177621,2.30447696 183.177621,5.23616343 C183.177621,8.16690814 185.46503,10.332947 188.967595,10.332947 L188.967595,10.332947 Z M18.2805882,19.8267893 C21.0209952,19.8267893 22.8516693,21.1537236 22.8516693,23.7369603 C22.8516693,29.1153289 14.8508764,30.300058 9.21314747,30.3725732 C9.44291575,25.2032744 12.1861248,19.8267893 18.2805882,19.8267893 L18.2805882,19.8267893 Z M18.8905016,44.4744277 C12.4158931,44.4744277 9.82399484,40.7723848 9.52137321,36.2359461 C18.5094225,36.1662562 31.2288712,34.3496088 31.2288712,23.5985222 C31.2288712,17.3857578 26.275777,13.8937265 18.8129781,13.8937265 C6.32142965,13.8937265 0,22.9694292 0,33.3014344 C0,43.7059548 5.02688156,50.9668937 17.9760986,50.9668937 C25.1344078,50.9668937 30.1622234,48.0333237 31.380182,47.0557809 L28.4856622,41.4014778 C26.6587242,42.5871487 23.3840592,44.4744277 18.8905016,44.4744277 L18.8905016,44.4744277 Z" id="logo@3x" fill="#FF6800"/></g></svg>'
      }, {
        name: "louis vuitton",
        logo: "path",
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 45" width="200" height="50" preserveAspectRatio="xMinYMid"><path d="M428.858.793h-5.451l-.793.892V27.85L394.764 0l-.794.793v42.222l.793.793h5.452l.892-.793V16.453l27.355 27.355h1.288V1.685zm-137.568.892v6.343h7.136v35.78h7.137V8.027h6.343l.892-.892V.793h-20.715zm26.265 0v6.343h7.136v35.78h7.136V8.027h6.343l.793-.892V.793h-20.615zM7.136.793H.793L0 1.685v42.123h21.507v-7.136H7.137zm40.636 0A21.507 21.507 0 1069.28 22.3 21.507 21.507 0 0047.772.793zm0 35.78A14.371 14.371 0 1162.044 22.3a14.272 14.272 0 01-14.272 14.272zM365.327.792A21.507 21.507 0 10386.735 22.3 21.507 21.507 0 00365.327.793zm0 35.78A14.371 14.371 0 11379.599 22.3a14.272 14.272 0 01-14.272 14.272zM101.094.792l-.793.793v27.85a7.136 7.136 0 01-7.136 7.136 7.235 7.235 0 01-7.235-7.136V1.586l-.793-.793h-5.55l-.793.793v27.85a14.371 14.371 0 1028.644 0V1.586l-.793-.793zm20.616.892v42.123h6.343l.892-.793V.793h-6.343zM251.547.793l-.893.793v27.85a7.136 7.136 0 01-14.272 0V1.586l-.892-.793h-5.45l-.794.793v27.85a14.371 14.371 0 1028.644 0V1.586l-.892-.793zm20.615.892v42.123h6.343l.793-.793V.793h-6.343zM155.804 19.03a54.016 54.016 0 01-4.757-2.875c-1.586-1.09-2.478-2.28-2.379-4.162a4.956 4.956 0 014.857-4.659 5.451 5.451 0 014.856 2.974h1.289l4.162-4.163A12.786 12.786 0 00153.525.793a12.488 12.488 0 00-8.623 3.072 12.19 12.19 0 00-3.965 8.822c0 4.559 2.478 8.325 4.857 9.613l7.631 4.361a5.253 5.253 0 013.073 5.947 5.55 5.55 0 01-6.343 4.163c-1.784-.198-3.568-1.586-4.46-2.18l-1.883-1.587-5.352 5.55a15.065 15.065 0 008.523 5.254 22.498 22.498 0 004.163.396 13.876 13.876 0 0013.677-13.776c0-7.236-6.442-10.01-9.019-11.398zm47.574 8.028L192.575.793h-7.83l17.84 43.015.793.792.892-.792L222.011.793h-7.73z" fill="#181716"></path></svg>'
      }]
    };
    var CV_DATA = {
      TITLE: "my cv",
      BTNTEXT: "download",
      URL: "./static/download/Pascal-Soulier-Front-End.pdf"
    };
    var SOCIAL_DATA = {
      LISTS: [{
        name: "linkedin",
        url: "https://www.linkedin.com/in/pascal-soulier-a52bb983/",
        rel: "external",
        target: "_target"
      }, {
        name: "twitter",
        url: "https://twitter.com/Sp_Devfront",
        rel: "external",
        target: "_target"
      }]
    };
    var COPYRIGHT_DATA = {
      TEXT: "copyright © pascal Soulier 2020"
    };
    var MOCK_DATA = {
      THEMESWITCH_DATA: THEMESWITCH_DATA,
      NAVBAR_DATA: NAVBAR_DATA,
      PROFIL_DATA: PROFIL_DATA,
      SKILLS_DATA: SKILLS_DATA,
      TOOLS_DATA: TOOLS_DATA,
      TRUST_DATA: TRUST_DATA,
      CV_DATA: CV_DATA,
      SOCIAL_DATA: SOCIAL_DATA,
      COPYRIGHT_DATA: COPYRIGHT_DATA
    };

    /* node_modules/smelte/src/components/Icon/Icon.svelte generated by Svelte v3.21.0 */

    const file = "node_modules/smelte/src/components/Icon/Icon.svelte";

    function create_fragment(ctx) {
    	let i;
    	let i_class_value;
    	let i_style_value;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	const block = {
    		c: function create() {
    			i = element("i");
    			if (default_slot) default_slot.c();
    			attr_dev(i, "aria-hidden", "true");
    			attr_dev(i, "class", i_class_value = "material-icons icon text-xl " + /*className*/ ctx[0] + " transition" + " svelte-h1x32v");
    			attr_dev(i, "style", i_style_value = /*color*/ ctx[5] ? `color: ${/*color*/ ctx[5]}` : "");
    			toggle_class(i, "reverse", /*reverse*/ ctx[3]);
    			toggle_class(i, "tip", /*tip*/ ctx[4]);
    			toggle_class(i, "text-base", /*small*/ ctx[1]);
    			toggle_class(i, "text-xs", /*xs*/ ctx[2]);
    			add_location(i, file, 24, 0, 1027);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, i, anchor);

    			if (default_slot) {
    				default_slot.m(i, null);
    			}

    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(i, "click", /*click_handler*/ ctx[8], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 64) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[6], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null));
    				}
    			}

    			if (!current || dirty & /*className*/ 1 && i_class_value !== (i_class_value = "material-icons icon text-xl " + /*className*/ ctx[0] + " transition" + " svelte-h1x32v")) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (!current || dirty & /*color*/ 32 && i_style_value !== (i_style_value = /*color*/ ctx[5] ? `color: ${/*color*/ ctx[5]}` : "")) {
    				attr_dev(i, "style", i_style_value);
    			}

    			if (dirty & /*className, reverse*/ 9) {
    				toggle_class(i, "reverse", /*reverse*/ ctx[3]);
    			}

    			if (dirty & /*className, tip*/ 17) {
    				toggle_class(i, "tip", /*tip*/ ctx[4]);
    			}

    			if (dirty & /*className, small*/ 3) {
    				toggle_class(i, "text-base", /*small*/ ctx[1]);
    			}

    			if (dirty & /*className, xs*/ 5) {
    				toggle_class(i, "text-xs", /*xs*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (default_slot) default_slot.d(detaching);
    			dispose();
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
    	let { class: className = "" } = $$props;
    	let { small = false } = $$props;
    	let { xs = false } = $$props;
    	let { reverse = false } = $$props;
    	let { tip = false } = $$props;
    	let { color = "default" } = $$props;
    	const writable_props = ["class", "small", "xs", "reverse", "tip", "color"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Icon", $$slots, ['default']);

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("class" in $$props) $$invalidate(0, className = $$props.class);
    		if ("small" in $$props) $$invalidate(1, small = $$props.small);
    		if ("xs" in $$props) $$invalidate(2, xs = $$props.xs);
    		if ("reverse" in $$props) $$invalidate(3, reverse = $$props.reverse);
    		if ("tip" in $$props) $$invalidate(4, tip = $$props.tip);
    		if ("color" in $$props) $$invalidate(5, color = $$props.color);
    		if ("$$scope" in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		small,
    		xs,
    		reverse,
    		tip,
    		color
    	});

    	$$self.$inject_state = $$props => {
    		if ("className" in $$props) $$invalidate(0, className = $$props.className);
    		if ("small" in $$props) $$invalidate(1, small = $$props.small);
    		if ("xs" in $$props) $$invalidate(2, xs = $$props.xs);
    		if ("reverse" in $$props) $$invalidate(3, reverse = $$props.reverse);
    		if ("tip" in $$props) $$invalidate(4, tip = $$props.tip);
    		if ("color" in $$props) $$invalidate(5, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [className, small, xs, reverse, tip, color, $$scope, $$slots, click_handler];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			class: 0,
    			small: 1,
    			xs: 2,
    			reverse: 3,
    			tip: 4,
    			color: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get class() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get small() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set small(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xs() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xs(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get reverse() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set reverse(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tip() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tip(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const noDepth = ["white", "black", "transparent"];

    function getClass(prop, color, depth, defaultDepth) {
      if (noDepth.includes(color)) {
        return `${prop}-${color}`;
      }
      return `${prop}-${color}-${depth || defaultDepth} `;
    }

    function utils(color, defaultDepth = 500) {
      return {
        bg: depth => getClass("bg", color, depth, defaultDepth),
        border: depth => getClass("border", color, depth, defaultDepth),
        txt: depth => getClass("text", color, depth, defaultDepth),
        caret: depth => getClass("caret", color, depth, defaultDepth)
      };
    }

    class ClassBuilder {
      constructor(classes, defaultClasses) {
        this.defaults =
          typeof classes === "function" ? classes(defaultClasses) : classes;

        this.classes = this.defaults;
      }

      flush() {
        this.classes = this.defaults;

        return this;
      }

      extend(...fns) {
        return this;
      }

      get() {
        return this.classes;
      }

      replace(classes, cond = true) {
        if (cond && classes) {
          this.classes = Object.keys(classes).reduce(
            (acc, from) => acc.replace(new RegExp(from, "g"), classes[from]),
            this.classes
          );
        }

        return this;
      }

      remove(classes, cond = true) {
        if (cond && classes) {
          this.classes = classes
            .split(" ")
            .reduce(
              (acc, cur) => acc.replace(new RegExp(cur, "g"), ""),
              this.classes
            );
        }

        return this;
      }

      add(className, cond = true, defaultValue) {
        if (!cond || !className) return this;

        switch (typeof className) {
          case "string":
          default:
            this.classes += ` ${className} `;
            return this;
          case "function":
            this.classes += ` ${className(defaultValue || this.classes)} `;
            return this;
        }
      }
    }

    function filterProps(reserved, props) {

      return Object.keys(props).reduce(
        (acc, cur) =>
          cur.includes("$$") || cur.includes("Class") || reserved.includes(cur)
            ? acc
            : { ...acc, [cur]: props[cur] },
        {}
      );
    }

    // Thanks Lagden! https://svelte.dev/repl/61d9178d2b9944f2aa2bfe31612ab09f?version=3.6.7
    function ripple(color, centered) {
      return function(event) {
        const target = event.currentTarget;
        const circle = document.createElement("span");
        const d = Math.max(target.clientWidth, target.clientHeight);

        const removeCircle = () => {
          circle.remove();
          circle.removeEventListener("animationend", removeCircle);
        };

        circle.addEventListener("animationend", removeCircle);
        circle.style.width = circle.style.height = `${d}px`;
        const rect = target.getBoundingClientRect();

        if (centered) {
          circle.classList.add(
            "absolute",
            "top-0",
            "left-0",
            "ripple-centered",
            `bg-${color}-transDark`
          );
        } else {
          circle.style.left = `${event.clientX - rect.left - d / 2}px`;
          circle.style.top = `${event.clientY - rect.top - d / 2}px`;

          circle.classList.add("ripple-normal", `bg-${color}-trans`);
        }

        circle.classList.add("ripple");

        target.appendChild(circle);
      };
    }

    function r(color = "primary", centered = false) {
      return function(node) {
        node.addEventListener("click", ripple(color, centered));

        return {
          onDestroy: () => node.removeEventListener("click")
        };
      };
    }

    /* node_modules/smelte/src/components/Button/Button.svelte generated by Svelte v3.21.0 */
    const file$1 = "node_modules/smelte/src/components/Button/Button.svelte";

    // (150:0) {:else}
    function create_else_block(ctx) {
    	let button;
    	let t;
    	let ripple_action;
    	let current;
    	let dispose;
    	let if_block = /*icon*/ ctx[3] && create_if_block_2(ctx);
    	const default_slot_template = /*$$slots*/ ctx[42].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[51], null);

    	let button_levels = [
    		{ class: /*classes*/ ctx[1] },
    		/*props*/ ctx[8],
    		{ disabled: /*disabled*/ ctx[2] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			add_location(button, file$1, 150, 2, 4076);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				action_destroyer(ripple_action = /*ripple*/ ctx[7].call(null, button)),
    				listen_dev(button, "click", /*click_handler_3*/ ctx[50], false, false, false),
    				listen_dev(button, "click", /*click_handler_1*/ ctx[46], false, false, false),
    				listen_dev(button, "mouseover", /*mouseover_handler_1*/ ctx[47], false, false, false),
    				listen_dev(button, "*", /*_handler_1*/ ctx[48], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (/*icon*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*icon*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(button, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty[1] & /*$$scope*/ 1048576) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[51], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[51], dirty, null));
    				}
    			}

    			set_attributes(button, get_spread_update(button_levels, [
    				dirty[0] & /*classes*/ 2 && { class: /*classes*/ ctx[1] },
    				dirty[0] & /*props*/ 256 && /*props*/ ctx[8],
    				dirty[0] & /*disabled*/ 4 && { disabled: /*disabled*/ ctx[2] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block.name,
    		type: "else",
    		source: "(150:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (129:0) {#if href}
    function create_if_block(ctx) {
    	let a;
    	let button;
    	let t;
    	let ripple_action;
    	let current;
    	let dispose;
    	let if_block = /*icon*/ ctx[3] && create_if_block_1(ctx);
    	const default_slot_template = /*$$slots*/ ctx[42].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[51], null);

    	let button_levels = [
    		{ class: /*classes*/ ctx[1] },
    		/*props*/ ctx[8],
    		{ disabled: /*disabled*/ ctx[2] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	let a_levels = [{ href: /*href*/ ctx[5] }, /*props*/ ctx[8]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			button = element("button");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			add_location(button, file$1, 133, 4, 3776);
    			set_attributes(a, a_data);
    			add_location(a, file$1, 129, 2, 3739);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, a, anchor);
    			append_dev(a, button);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				action_destroyer(ripple_action = /*ripple*/ ctx[7].call(null, button)),
    				listen_dev(button, "click", /*click_handler_2*/ ctx[49], false, false, false),
    				listen_dev(button, "click", /*click_handler*/ ctx[43], false, false, false),
    				listen_dev(button, "mouseover", /*mouseover_handler*/ ctx[44], false, false, false),
    				listen_dev(button, "*", /*_handler*/ ctx[45], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (/*icon*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*icon*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(button, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty[1] & /*$$scope*/ 1048576) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[51], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[51], dirty, null));
    				}
    			}

    			set_attributes(button, get_spread_update(button_levels, [
    				dirty[0] & /*classes*/ 2 && { class: /*classes*/ ctx[1] },
    				dirty[0] & /*props*/ 256 && /*props*/ ctx[8],
    				dirty[0] & /*disabled*/ 4 && { disabled: /*disabled*/ ctx[2] }
    			]));

    			set_attributes(a, get_spread_update(a_levels, [
    				dirty[0] & /*href*/ 32 && { href: /*href*/ ctx[5] },
    				dirty[0] & /*props*/ 256 && /*props*/ ctx[8]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block.name,
    		type: "if",
    		source: "(129:0) {#if href}",
    		ctx
    	});

    	return block_1;
    }

    // (161:4) {#if icon}
    function create_if_block_2(ctx) {
    	let current;

    	const icon_1 = new Icon({
    			props: {
    				class: /*iClasses*/ ctx[6],
    				small: /*small*/ ctx[4],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(icon_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_1_changes = {};
    			if (dirty[0] & /*iClasses*/ 64) icon_1_changes.class = /*iClasses*/ ctx[6];
    			if (dirty[0] & /*small*/ 16) icon_1_changes.small = /*small*/ ctx[4];

    			if (dirty[0] & /*icon*/ 8 | dirty[1] & /*$$scope*/ 1048576) {
    				icon_1_changes.$$scope = { dirty, ctx };
    			}

    			icon_1.$set(icon_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(161:4) {#if icon}",
    		ctx
    	});

    	return block_1;
    }

    // (162:6) <Icon class={iClasses} {small}>
    function create_default_slot_1(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*icon*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*icon*/ 8) set_data_dev(t, /*icon*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(162:6) <Icon class={iClasses} {small}>",
    		ctx
    	});

    	return block_1;
    }

    // (144:6) {#if icon}
    function create_if_block_1(ctx) {
    	let current;

    	const icon_1 = new Icon({
    			props: {
    				class: /*iClasses*/ ctx[6],
    				small: /*small*/ ctx[4],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(icon_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_1_changes = {};
    			if (dirty[0] & /*iClasses*/ 64) icon_1_changes.class = /*iClasses*/ ctx[6];
    			if (dirty[0] & /*small*/ 16) icon_1_changes.small = /*small*/ ctx[4];

    			if (dirty[0] & /*icon*/ 8 | dirty[1] & /*$$scope*/ 1048576) {
    				icon_1_changes.$$scope = { dirty, ctx };
    			}

    			icon_1.$set(icon_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(144:6) {#if icon}",
    		ctx
    	});

    	return block_1;
    }

    // (145:8) <Icon class={iClasses} {small}>
    function create_default_slot(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*icon*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*icon*/ 8) set_data_dev(t, /*icon*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(145:8) <Icon class={iClasses} {small}>",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[5]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    const classesDefault = "py-2 px-4 uppercase text-sm font-medium relative overflow-hidden";
    const basicDefault = "text-white transition";
    const outlinedDefault = "bg-transparent border border-solid";
    const textDefault = "bg-transparent border-none px-4 hover:bg-transparent";
    const iconDefault = "p-4 flex items-center";
    const fabDefault = "hover:bg-transparent";
    const smallDefault = "pt-1 pb-1 pl-2 pr-2 text-xs";
    const disabledDefault = "bg-gray-300 text-gray-500 dark:bg-dark-400 elevation-none pointer-events-none hover:bg-gray-300 cursor-default";
    const elevationDefault = "hover:elevation-5 elevation-3";

    function instance$1($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { value = false } = $$props;
    	let { outlined = false } = $$props;
    	let { text = false } = $$props;
    	let { block = false } = $$props;
    	let { disabled = false } = $$props;
    	let { icon = null } = $$props;
    	let { small = false } = $$props;
    	let { light = false } = $$props;
    	let { dark = false } = $$props;
    	let { flat = false } = $$props;
    	let { iconClass = "" } = $$props;
    	let { color = "primary" } = $$props;
    	let { href = null } = $$props;
    	let { fab = false } = $$props;
    	let { remove = "" } = $$props;
    	let { add = "" } = $$props;
    	let { replace = {} } = $$props;
    	let { classes = classesDefault } = $$props;
    	let { basicClasses = basicDefault } = $$props;
    	let { outlinedClasses = outlinedDefault } = $$props;
    	let { textClasses = textDefault } = $$props;
    	let { iconClasses = iconDefault } = $$props;
    	let { fabClasses = fabDefault } = $$props;
    	let { smallClasses = smallDefault } = $$props;
    	let { disabledClasses = disabledDefault } = $$props;
    	let { elevationClasses = elevationDefault } = $$props;
    	fab = fab || text && icon;
    	const basic = !outlined && !text && !fab;
    	const elevation = (basic || icon) && !disabled && !flat && !text;
    	let Classes = i => i;
    	let iClasses = i => i;
    	let shade = 0;
    	const { bg, border, txt } = utils(color);
    	const cb = new ClassBuilder(classes, classesDefault);
    	let iconCb;

    	if (icon) {
    		iconCb = new ClassBuilder(iconClass);
    	}

    	const ripple = r(text || fab || outlined ? color : "white");

    	const props = filterProps(
    		[
    			"outlined",
    			"text",
    			"color",
    			"block",
    			"disabled",
    			"icon",
    			"small",
    			"light",
    			"dark",
    			"flat",
    			"add",
    			"remove",
    			"replace"
    		],
    		$$props
    	);

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Button", $$slots, ['default']);

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function _handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble($$self, event);
    	}

    	function _handler_1(event) {
    		bubble($$self, event);
    	}

    	const click_handler_2 = () => $$invalidate(0, value = !value);
    	const click_handler_3 = () => $$invalidate(0, value = !value);

    	$$self.$set = $$new_props => {
    		$$invalidate(41, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ("value" in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ("outlined" in $$new_props) $$invalidate(11, outlined = $$new_props.outlined);
    		if ("text" in $$new_props) $$invalidate(12, text = $$new_props.text);
    		if ("block" in $$new_props) $$invalidate(13, block = $$new_props.block);
    		if ("disabled" in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("icon" in $$new_props) $$invalidate(3, icon = $$new_props.icon);
    		if ("small" in $$new_props) $$invalidate(4, small = $$new_props.small);
    		if ("light" in $$new_props) $$invalidate(14, light = $$new_props.light);
    		if ("dark" in $$new_props) $$invalidate(15, dark = $$new_props.dark);
    		if ("flat" in $$new_props) $$invalidate(16, flat = $$new_props.flat);
    		if ("iconClass" in $$new_props) $$invalidate(17, iconClass = $$new_props.iconClass);
    		if ("color" in $$new_props) $$invalidate(18, color = $$new_props.color);
    		if ("href" in $$new_props) $$invalidate(5, href = $$new_props.href);
    		if ("fab" in $$new_props) $$invalidate(9, fab = $$new_props.fab);
    		if ("remove" in $$new_props) $$invalidate(19, remove = $$new_props.remove);
    		if ("add" in $$new_props) $$invalidate(20, add = $$new_props.add);
    		if ("replace" in $$new_props) $$invalidate(21, replace = $$new_props.replace);
    		if ("classes" in $$new_props) $$invalidate(1, classes = $$new_props.classes);
    		if ("basicClasses" in $$new_props) $$invalidate(22, basicClasses = $$new_props.basicClasses);
    		if ("outlinedClasses" in $$new_props) $$invalidate(23, outlinedClasses = $$new_props.outlinedClasses);
    		if ("textClasses" in $$new_props) $$invalidate(24, textClasses = $$new_props.textClasses);
    		if ("iconClasses" in $$new_props) $$invalidate(25, iconClasses = $$new_props.iconClasses);
    		if ("fabClasses" in $$new_props) $$invalidate(26, fabClasses = $$new_props.fabClasses);
    		if ("smallClasses" in $$new_props) $$invalidate(27, smallClasses = $$new_props.smallClasses);
    		if ("disabledClasses" in $$new_props) $$invalidate(28, disabledClasses = $$new_props.disabledClasses);
    		if ("elevationClasses" in $$new_props) $$invalidate(29, elevationClasses = $$new_props.elevationClasses);
    		if ("$$scope" in $$new_props) $$invalidate(51, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		utils,
    		ClassBuilder,
    		filterProps,
    		createRipple: r,
    		className,
    		value,
    		outlined,
    		text,
    		block,
    		disabled,
    		icon,
    		small,
    		light,
    		dark,
    		flat,
    		iconClass,
    		color,
    		href,
    		fab,
    		remove,
    		add,
    		replace,
    		classesDefault,
    		basicDefault,
    		outlinedDefault,
    		textDefault,
    		iconDefault,
    		fabDefault,
    		smallDefault,
    		disabledDefault,
    		elevationDefault,
    		classes,
    		basicClasses,
    		outlinedClasses,
    		textClasses,
    		iconClasses,
    		fabClasses,
    		smallClasses,
    		disabledClasses,
    		elevationClasses,
    		basic,
    		elevation,
    		Classes,
    		iClasses,
    		shade,
    		bg,
    		border,
    		txt,
    		cb,
    		iconCb,
    		ripple,
    		props,
    		normal,
    		lighter
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(41, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(10, className = $$new_props.className);
    		if ("value" in $$props) $$invalidate(0, value = $$new_props.value);
    		if ("outlined" in $$props) $$invalidate(11, outlined = $$new_props.outlined);
    		if ("text" in $$props) $$invalidate(12, text = $$new_props.text);
    		if ("block" in $$props) $$invalidate(13, block = $$new_props.block);
    		if ("disabled" in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("icon" in $$props) $$invalidate(3, icon = $$new_props.icon);
    		if ("small" in $$props) $$invalidate(4, small = $$new_props.small);
    		if ("light" in $$props) $$invalidate(14, light = $$new_props.light);
    		if ("dark" in $$props) $$invalidate(15, dark = $$new_props.dark);
    		if ("flat" in $$props) $$invalidate(16, flat = $$new_props.flat);
    		if ("iconClass" in $$props) $$invalidate(17, iconClass = $$new_props.iconClass);
    		if ("color" in $$props) $$invalidate(18, color = $$new_props.color);
    		if ("href" in $$props) $$invalidate(5, href = $$new_props.href);
    		if ("fab" in $$props) $$invalidate(9, fab = $$new_props.fab);
    		if ("remove" in $$props) $$invalidate(19, remove = $$new_props.remove);
    		if ("add" in $$props) $$invalidate(20, add = $$new_props.add);
    		if ("replace" in $$props) $$invalidate(21, replace = $$new_props.replace);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ("basicClasses" in $$props) $$invalidate(22, basicClasses = $$new_props.basicClasses);
    		if ("outlinedClasses" in $$props) $$invalidate(23, outlinedClasses = $$new_props.outlinedClasses);
    		if ("textClasses" in $$props) $$invalidate(24, textClasses = $$new_props.textClasses);
    		if ("iconClasses" in $$props) $$invalidate(25, iconClasses = $$new_props.iconClasses);
    		if ("fabClasses" in $$props) $$invalidate(26, fabClasses = $$new_props.fabClasses);
    		if ("smallClasses" in $$props) $$invalidate(27, smallClasses = $$new_props.smallClasses);
    		if ("disabledClasses" in $$props) $$invalidate(28, disabledClasses = $$new_props.disabledClasses);
    		if ("elevationClasses" in $$props) $$invalidate(29, elevationClasses = $$new_props.elevationClasses);
    		if ("Classes" in $$props) Classes = $$new_props.Classes;
    		if ("iClasses" in $$props) $$invalidate(6, iClasses = $$new_props.iClasses);
    		if ("shade" in $$props) $$invalidate(30, shade = $$new_props.shade);
    		if ("iconCb" in $$props) $$invalidate(31, iconCb = $$new_props.iconCb);
    		if ("normal" in $$props) $$invalidate(32, normal = $$new_props.normal);
    		if ("lighter" in $$props) $$invalidate(33, lighter = $$new_props.lighter);
    	};

    	let normal;
    	let lighter;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*light, dark, shade*/ 1073790976) {
    			 {
    				$$invalidate(30, shade = light ? 200 : 0);
    				$$invalidate(30, shade = dark ? -400 : shade);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*shade*/ 1073741824) {
    			 $$invalidate(32, normal = 500 - shade);
    		}

    		if ($$self.$$.dirty[0] & /*shade*/ 1073741824) {
    			 $$invalidate(33, lighter = 400 - shade);
    		}

    		if ($$self.$$.dirty[0] & /*basicClasses, elevationClasses, outlinedClasses, outlined, text, textClasses, iconClasses, icon, fab, disabledClasses, disabled, smallClasses, small, block, fabClasses, className, remove, replace, add*/ 1073233436 | $$self.$$.dirty[1] & /*normal, lighter*/ 6) {
    			 $$invalidate(1, classes = cb.flush().add(basicClasses, basic, basicDefault).add(`${bg(normal)} hover:${bg(lighter)}`, basic).add(elevationClasses, elevation, elevationDefault).add(outlinedClasses, outlined, outlinedDefault).add(`${border(lighter)} ${txt(normal)} hover:${bg("trans")} dark-hover:${bg("transDark")}`, outlined).add(`${txt(lighter)}`, text).add(textClasses, text, textDefault).add(iconClasses, icon, iconDefault).remove("py-2", icon).remove(txt(lighter), fab).add(disabledClasses, disabled, disabledDefault).add(smallClasses, small, smallDefault).add("flex items-center justify-center h-8 w-8", small && icon).add("border-solid", outlined).add("rounded-full", icon).add("w-full", block).add("rounded", basic || outlined || text).add("button", !icon).add(fabClasses, fab, fabDefault).add(`hover:${bg("transLight")}`, fab).add(className).remove(remove).replace(replace).add(add).get());
    		}

    		if ($$self.$$.dirty[0] & /*fab, iconClass*/ 131584 | $$self.$$.dirty[1] & /*iconCb*/ 1) {
    			 if (iconCb) {
    				$$invalidate(6, iClasses = iconCb.flush().add(txt(), fab && !iconClass).get());
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		value,
    		classes,
    		disabled,
    		icon,
    		small,
    		href,
    		iClasses,
    		ripple,
    		props,
    		fab,
    		className,
    		outlined,
    		text,
    		block,
    		light,
    		dark,
    		flat,
    		iconClass,
    		color,
    		remove,
    		add,
    		replace,
    		basicClasses,
    		outlinedClasses,
    		textClasses,
    		iconClasses,
    		fabClasses,
    		smallClasses,
    		disabledClasses,
    		elevationClasses,
    		shade,
    		iconCb,
    		normal,
    		lighter,
    		basic,
    		elevation,
    		Classes,
    		bg,
    		border,
    		txt,
    		cb,
    		$$props,
    		$$slots,
    		click_handler,
    		mouseover_handler,
    		_handler,
    		click_handler_1,
    		mouseover_handler_1,
    		_handler_1,
    		click_handler_2,
    		click_handler_3,
    		$$scope
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				class: 10,
    				value: 0,
    				outlined: 11,
    				text: 12,
    				block: 13,
    				disabled: 2,
    				icon: 3,
    				small: 4,
    				light: 14,
    				dark: 15,
    				flat: 16,
    				iconClass: 17,
    				color: 18,
    				href: 5,
    				fab: 9,
    				remove: 19,
    				add: 20,
    				replace: 21,
    				classes: 1,
    				basicClasses: 22,
    				outlinedClasses: 23,
    				textClasses: 24,
    				iconClasses: 25,
    				fabClasses: 26,
    				smallClasses: 27,
    				disabledClasses: 28,
    				elevationClasses: 29
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlined() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get small() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set small(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flat() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flat(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconClass() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconClass(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fab() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fab(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get remove() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set remove(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get add() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set add(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classes() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classes(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get basicClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basicClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlinedClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlinedClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fabClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fabClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get smallClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set smallClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabledClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabledClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get elevationClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set elevationClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => `overflow: hidden;` +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /* node_modules/smelte/src/components/Chip/Chip.svelte generated by Svelte v3.21.0 */
    const file$2 = "node_modules/smelte/src/components/Chip/Chip.svelte";

    // (76:0) {#if value}
    function create_if_block$1(ctx) {
    	let span1;
    	let button;
    	let t0;
    	let span0;
    	let t1;
    	let ripple_action;
    	let span1_class_value;
    	let span1_outro;
    	let current;
    	let dispose;
    	let if_block0 = /*icon*/ ctx[2] && create_if_block_2$1(ctx);
    	const default_slot_template = /*$$slots*/ ctx[24].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[26], null);
    	let if_block1 = /*removable*/ ctx[1] && create_if_block_1$1(ctx);
    	let button_levels = [{ class: /*classes*/ ctx[5] }, /*props*/ ctx[11]];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			button = element("button");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			span0 = element("span");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(span0, "class", "px-2 text-sm");
    			add_location(span0, file$2, 88, 6, 2421);
    			set_attributes(button, button_data);
    			toggle_class(button, "svelte-1brfb26", true);
    			add_location(button, file$2, 77, 4, 2182);
    			attr_dev(span1, "class", span1_class_value = "" + (/*c*/ ctx[7] + " mx-1 inline-block" + " svelte-1brfb26"));
    			add_location(span1, file$2, 76, 2, 2111);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, button);
    			if (if_block0) if_block0.m(button, null);
    			append_dev(button, t0);
    			append_dev(button, span0);

    			if (default_slot) {
    				default_slot.m(span0, null);
    			}

    			append_dev(button, t1);
    			if (if_block1) if_block1.m(button, null);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button, "click", /*click_handler*/ ctx[25], false, false, false),
    				action_destroyer(ripple_action = /*ripple*/ ctx[4].call(null, button)),
    				listen_dev(button, "click", /*select*/ ctx[9], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (/*icon*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*icon*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(button, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 67108864) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[26], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[26], dirty, null));
    				}
    			}

    			if (/*removable*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*removable*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(button, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			set_attributes(button, get_spread_update(button_levels, [
    				dirty & /*classes*/ 32 && { class: /*classes*/ ctx[5] },
    				dirty & /*props*/ 2048 && /*props*/ ctx[11]
    			]));

    			toggle_class(button, "svelte-1brfb26", true);

    			if (!current || dirty & /*c*/ 128 && span1_class_value !== (span1_class_value = "" + (/*c*/ ctx[7] + " mx-1 inline-block" + " svelte-1brfb26"))) {
    				attr_dev(span1, "class", span1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(default_slot, local);
    			transition_in(if_block1);
    			if (span1_outro) span1_outro.end(1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(default_slot, local);
    			transition_out(if_block1);
    			span1_outro = create_out_transition(span1, scale, { duration: 100 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    			if (if_block0) if_block0.d();
    			if (default_slot) default_slot.d(detaching);
    			if (if_block1) if_block1.d();
    			if (detaching && span1_outro) span1_outro.end();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(76:0) {#if value}",
    		ctx
    	});

    	return block;
    }

    // (84:6) {#if icon}
    function create_if_block_2$1(ctx) {
    	let current;

    	const icon_1 = new Icon({
    			props: {
    				small: true,
    				class: /*selected*/ ctx[0]
    				? /*txt*/ ctx[10](400)
    				: "text-gray-600",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_1_changes = {};

    			if (dirty & /*selected*/ 1) icon_1_changes.class = /*selected*/ ctx[0]
    			? /*txt*/ ctx[10](400)
    			: "text-gray-600";

    			if (dirty & /*$$scope, icon*/ 67108868) {
    				icon_1_changes.$$scope = { dirty, ctx };
    			}

    			icon_1.$set(icon_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(84:6) {#if icon}",
    		ctx
    	});

    	return block;
    }

    // (85:8) <Icon small class={selected ? txt(400) : 'text-gray-600'}>
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*icon*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*icon*/ 4) set_data_dev(t, /*icon*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(85:8) <Icon small class={selected ? txt(400) : 'text-gray-600'}>",
    		ctx
    	});

    	return block;
    }

    // (92:6) {#if removable}
    function create_if_block_1$1(ctx) {
    	let span;
    	let span_class_value;
    	let current;
    	let dispose;

    	const icon_1 = new Icon({
    			props: {
    				class: "text-white dark:text-white",
    				xs: true,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(icon_1.$$.fragment);
    			attr_dev(span, "class", span_class_value = "rounded-full p-1/2 inline-flex items-center cursor-pointer " + /*iconClass*/ ctx[6] + " svelte-1brfb26");
    			add_location(span, file$2, 92, 8, 2510);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, span, anchor);
    			mount_component(icon_1, span, null);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(span, "click", stop_propagation(/*close*/ ctx[8]), false, false, true);
    		},
    		p: function update(ctx, dirty) {
    			const icon_1_changes = {};

    			if (dirty & /*$$scope*/ 67108864) {
    				icon_1_changes.$$scope = { dirty, ctx };
    			}

    			icon_1.$set(icon_1_changes);

    			if (!current || dirty & /*iconClass*/ 64 && span_class_value !== (span_class_value = "rounded-full p-1/2 inline-flex items-center cursor-pointer " + /*iconClass*/ ctx[6] + " svelte-1brfb26")) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(icon_1);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(92:6) {#if removable}",
    		ctx
    	});

    	return block;
    }

    // (96:10) <Icon class="text-white dark:text-white" xs>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("clear");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(96:10) <Icon class=\\\"text-white dark:text-white\\\" xs>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*value*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*value*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*value*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let { class: className = "" } = $$props;
    	let { removable = false } = $$props;
    	let { icon = "" } = $$props;
    	let { outlined = false } = $$props;
    	let { selected = false } = $$props;
    	let { selectable = true } = $$props;
    	let { color = "primary" } = $$props;
    	let { remove = "" } = $$props;
    	let { add = "" } = $$props;
    	let { replace = {} } = $$props;
    	let value = true;
    	const dispatch = createEventDispatcher();

    	function close() {
    		dispatch("close");
    		$$invalidate(3, value = false);
    	}

    	function select() {
    		if (!selectable) return;
    		$$invalidate(0, selected = true);
    	}

    	const { bg, txt, border } = utils(color);
    	const cb = new ClassBuilder();
    	const props = filterProps(["removable", "icon", "outlined", "selected", "selectable", "color"], $$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Chip", $$slots, ['default']);

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(12, className = $$new_props.class);
    		if ("removable" in $$new_props) $$invalidate(1, removable = $$new_props.removable);
    		if ("icon" in $$new_props) $$invalidate(2, icon = $$new_props.icon);
    		if ("outlined" in $$new_props) $$invalidate(13, outlined = $$new_props.outlined);
    		if ("selected" in $$new_props) $$invalidate(0, selected = $$new_props.selected);
    		if ("selectable" in $$new_props) $$invalidate(14, selectable = $$new_props.selectable);
    		if ("color" in $$new_props) $$invalidate(15, color = $$new_props.color);
    		if ("remove" in $$new_props) $$invalidate(16, remove = $$new_props.remove);
    		if ("add" in $$new_props) $$invalidate(17, add = $$new_props.add);
    		if ("replace" in $$new_props) $$invalidate(18, replace = $$new_props.replace);
    		if ("$$scope" in $$new_props) $$invalidate(26, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		scale,
    		createRipple: r,
    		utils,
    		ClassBuilder,
    		filterProps,
    		Icon,
    		className,
    		removable,
    		icon,
    		outlined,
    		selected,
    		selectable,
    		color,
    		remove,
    		add,
    		replace,
    		value,
    		dispatch,
    		close,
    		select,
    		bg,
    		txt,
    		border,
    		cb,
    		props,
    		ripple,
    		classes,
    		iconClass,
    		c
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(12, className = $$new_props.className);
    		if ("removable" in $$props) $$invalidate(1, removable = $$new_props.removable);
    		if ("icon" in $$props) $$invalidate(2, icon = $$new_props.icon);
    		if ("outlined" in $$props) $$invalidate(13, outlined = $$new_props.outlined);
    		if ("selected" in $$props) $$invalidate(0, selected = $$new_props.selected);
    		if ("selectable" in $$props) $$invalidate(14, selectable = $$new_props.selectable);
    		if ("color" in $$props) $$invalidate(15, color = $$new_props.color);
    		if ("remove" in $$props) $$invalidate(16, remove = $$new_props.remove);
    		if ("add" in $$props) $$invalidate(17, add = $$new_props.add);
    		if ("replace" in $$props) $$invalidate(18, replace = $$new_props.replace);
    		if ("value" in $$props) $$invalidate(3, value = $$new_props.value);
    		if ("ripple" in $$props) $$invalidate(4, ripple = $$new_props.ripple);
    		if ("classes" in $$props) $$invalidate(5, classes = $$new_props.classes);
    		if ("iconClass" in $$props) $$invalidate(6, iconClass = $$new_props.iconClass);
    		if ("c" in $$props) $$invalidate(7, c = $$new_props.c);
    	};

    	let ripple;
    	let classes;
    	let iconClass;
    	let c;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*color*/ 32768) {
    			 $$invalidate(4, ripple = r(color));
    		}

    		if ($$self.$$.dirty & /*outlined, selected, remove, replace, add*/ 466945) {
    			 $$invalidate(5, classes = cb.flush().add("relative overflow-hidden flex items-center rounded-full px-2 py-1").add("bg-transparent border", outlined).add("border-gray-400 border-solid hover:bg-gray-50 dark-hover:bg-dark-400 bg-gray-300 dark:bg-dark-600", !selected).add(`${border()} dark:${border("800")} ${txt()} ${bg(100)} hover:${bg(50)}`, selected).remove(remove).replace(replace).add(add).get());
    		}

    		if ($$self.$$.dirty & /*selected*/ 1) {
    			 $$invalidate(6, iconClass = selected
    			? `hover:${bg(300)} ${bg(400)}`
    			: "hover:bg-gray-400 bg-gray-500 dark:bg-gray-800");
    		}

    		if ($$self.$$.dirty & /*className*/ 4096) {
    			 $$invalidate(7, c = cb.flush().add(className).get());
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		selected,
    		removable,
    		icon,
    		value,
    		ripple,
    		classes,
    		iconClass,
    		c,
    		close,
    		select,
    		txt,
    		props,
    		className,
    		outlined,
    		selectable,
    		color,
    		remove,
    		add,
    		replace,
    		dispatch,
    		bg,
    		border,
    		cb,
    		$$props,
    		$$slots,
    		click_handler,
    		$$scope
    	];
    }

    class Chip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			class: 12,
    			removable: 1,
    			icon: 2,
    			outlined: 13,
    			selected: 0,
    			selectable: 14,
    			color: 15,
    			remove: 16,
    			add: 17,
    			replace: 18
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chip",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get class() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removable() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set removable(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlined() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectable() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectable(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get remove() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set remove(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get add() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set add(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-waypoint/src/Waypoint.svelte generated by Svelte v3.21.0 */
    const file$3 = "node_modules/svelte-waypoint/src/Waypoint.svelte";

    // (139:2) {#if visible}
    function create_if_block$2(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32768) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[15], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(139:2) {#if visible}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let div_class_value;
    	let waypoint_action;
    	let current;
    	let dispose;
    	let if_block = /*visible*/ ctx[3] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", div_class_value = "wrapper " + /*className*/ ctx[2] + " " + /*c*/ ctx[0] + " svelte-a5tf4d");
    			attr_dev(div, "style", /*style*/ ctx[1]);
    			add_location(div, file$3, 137, 0, 3472);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    			if (remount) dispose();
    			dispose = action_destroyer(waypoint_action = /*waypoint*/ ctx[4].call(null, div));
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*visible*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*visible*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*className, c*/ 5 && div_class_value !== (div_class_value = "wrapper " + /*className*/ ctx[2] + " " + /*c*/ ctx[0] + " svelte-a5tf4d")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*style*/ 2) {
    				attr_dev(div, "style", /*style*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			dispose();
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

    function throttleFn(fn, time) {
    	let last, deferTimer;

    	return () => {
    		const now = +new Date();

    		if (last && now < last + time) {
    			// hold on to it
    			clearTimeout(deferTimer);

    			deferTimer = setTimeout(
    				function () {
    					last = now;
    					fn();
    				},
    				time
    			);
    		} else {
    			last = now;
    			fn();
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let { offset = 0 } = $$props;
    	let { throttle = 250 } = $$props;
    	let { c = "" } = $$props;
    	let { style = "" } = $$props;
    	let { once = true } = $$props;
    	let { threshold = 1 } = $$props;
    	let { disabled = false } = $$props;
    	let { class: className = "" } = $$props;
    	let visible = disabled;
    	let wasVisible = false;
    	let intersecting = false;

    	let removeHandlers = () => {
    		
    	};

    	function callEvents(wasVisible, observer, node) {
    		if (visible && !wasVisible) {
    			dispatch("enter");
    			return;
    		}

    		if (wasVisible && !intersecting) {
    			dispatch("leave");
    		}

    		if (once && wasVisible && !intersecting) {
    			removeHandlers();
    		}
    	}

    	function waypoint(node) {
    		if (!window || disabled) return;

    		if (window.IntersectionObserver && window.IntersectionObserverEntry) {
    			const observer = new IntersectionObserver(([{ isIntersecting }]) => {
    					wasVisible = visible;
    					intersecting = isIntersecting;

    					if (wasVisible && once && !isIntersecting) {
    						callEvents(wasVisible);
    						return;
    					}

    					$$invalidate(3, visible = isIntersecting);
    					callEvents(wasVisible);
    				},
    			{ rootMargin: offset + "px", threshold });

    			observer.observe(node);
    			removeHandlers = () => observer.unobserve(node);
    			return removeHandlers;
    		}

    		function checkIsVisible() {
    			// Kudos https://github.com/twobin/react-lazyload/blob/master/src/index.jsx#L93
    			if (!(node.offsetWidth || node.offsetHeight || node.getClientRects().length)) return;

    			let top;
    			let height;

    			try {
    				({ top, height } = node.getBoundingClientRect());
    			} catch(e) {
    				({ top, height } = defaultBoundingClientRect);
    			}

    			const windowInnerHeight = window.innerHeight || document.documentElement.clientHeight;
    			wasVisible = visible;
    			intersecting = top - offset <= windowInnerHeight && top + height + offset >= 0;

    			if (wasVisible && once && !isIntersecting) {
    				callEvents(wasVisible, observer);
    				return;
    			}

    			$$invalidate(3, visible = intersecting);
    			callEvents(wasVisible);
    		}

    		checkIsVisible();
    		const throttled = throttleFn(checkIsVisible, throttle);
    		window.addEventListener("scroll", throttled);
    		window.addEventListener("resize", throttled);

    		removeHandlers = () => {
    			window.removeEventListener("scroll", throttled);
    			window.removeEventListener("resize", throttled);
    		};

    		return removeHandlers;
    	}

    	const writable_props = ["offset", "throttle", "c", "style", "once", "threshold", "disabled", "class"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Waypoint> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Waypoint", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("offset" in $$props) $$invalidate(5, offset = $$props.offset);
    		if ("throttle" in $$props) $$invalidate(6, throttle = $$props.throttle);
    		if ("c" in $$props) $$invalidate(0, c = $$props.c);
    		if ("style" in $$props) $$invalidate(1, style = $$props.style);
    		if ("once" in $$props) $$invalidate(7, once = $$props.once);
    		if ("threshold" in $$props) $$invalidate(8, threshold = $$props.threshold);
    		if ("disabled" in $$props) $$invalidate(9, disabled = $$props.disabled);
    		if ("class" in $$props) $$invalidate(2, className = $$props.class);
    		if ("$$scope" in $$props) $$invalidate(15, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		dispatch,
    		offset,
    		throttle,
    		c,
    		style,
    		once,
    		threshold,
    		disabled,
    		className,
    		visible,
    		wasVisible,
    		intersecting,
    		removeHandlers,
    		throttleFn,
    		callEvents,
    		waypoint
    	});

    	$$self.$inject_state = $$props => {
    		if ("offset" in $$props) $$invalidate(5, offset = $$props.offset);
    		if ("throttle" in $$props) $$invalidate(6, throttle = $$props.throttle);
    		if ("c" in $$props) $$invalidate(0, c = $$props.c);
    		if ("style" in $$props) $$invalidate(1, style = $$props.style);
    		if ("once" in $$props) $$invalidate(7, once = $$props.once);
    		if ("threshold" in $$props) $$invalidate(8, threshold = $$props.threshold);
    		if ("disabled" in $$props) $$invalidate(9, disabled = $$props.disabled);
    		if ("className" in $$props) $$invalidate(2, className = $$props.className);
    		if ("visible" in $$props) $$invalidate(3, visible = $$props.visible);
    		if ("wasVisible" in $$props) wasVisible = $$props.wasVisible;
    		if ("intersecting" in $$props) intersecting = $$props.intersecting;
    		if ("removeHandlers" in $$props) removeHandlers = $$props.removeHandlers;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		c,
    		style,
    		className,
    		visible,
    		waypoint,
    		offset,
    		throttle,
    		once,
    		threshold,
    		disabled,
    		wasVisible,
    		intersecting,
    		removeHandlers,
    		dispatch,
    		callEvents,
    		$$scope,
    		$$slots
    	];
    }

    class Waypoint extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			offset: 5,
    			throttle: 6,
    			c: 0,
    			style: 1,
    			once: 7,
    			threshold: 8,
    			disabled: 9,
    			class: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Waypoint",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get offset() {
    		throw new Error("<Waypoint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<Waypoint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get throttle() {
    		throw new Error("<Waypoint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set throttle(value) {
    		throw new Error("<Waypoint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get c() {
    		throw new Error("<Waypoint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set c(value) {
    		throw new Error("<Waypoint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Waypoint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Waypoint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get once() {
    		throw new Error("<Waypoint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set once(value) {
    		throw new Error("<Waypoint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get threshold() {
    		throw new Error("<Waypoint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set threshold(value) {
    		throw new Error("<Waypoint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Waypoint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Waypoint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Waypoint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Waypoint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/smelte/src/components/Image/Image.svelte generated by Svelte v3.21.0 */
    const file$4 = "node_modules/smelte/src/components/Image/Image.svelte";
    const get_loading_slot_changes = dirty => ({});
    const get_loading_slot_context = ctx => ({});

    // (33:20) 
    function create_if_block_2$2(ctx) {
    	let current;
    	const loading_slot_template = /*$$slots*/ ctx[9].loading;
    	const loading_slot = create_slot(loading_slot_template, ctx, /*$$scope*/ ctx[10], get_loading_slot_context);

    	const block = {
    		c: function create() {
    			if (loading_slot) loading_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (loading_slot) {
    				loading_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (loading_slot) {
    				if (loading_slot.p && dirty & /*$$scope*/ 1024) {
    					loading_slot.p(get_slot_context(loading_slot_template, ctx, /*$$scope*/ ctx[10], get_loading_slot_context), get_slot_changes(loading_slot_template, /*$$scope*/ ctx[10], dirty, get_loading_slot_changes));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (loading_slot) loading_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(33:20) ",
    		ctx
    	});

    	return block;
    }

    // (31:22) 
    function create_if_block_1$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", /*className*/ ctx[5]);
    			if (img.src !== (img_src_value = /*thumbnail*/ ctx[4])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alt*/ ctx[0]);
    			attr_dev(img, "width", /*width*/ ctx[1]);
    			attr_dev(img, "height", /*height*/ ctx[2]);
    			add_location(img, file$4, 31, 4, 691);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*className*/ 32) {
    				attr_dev(img, "class", /*className*/ ctx[5]);
    			}

    			if (dirty & /*thumbnail*/ 16 && img.src !== (img_src_value = /*thumbnail*/ ctx[4])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*alt*/ 1) {
    				attr_dev(img, "alt", /*alt*/ ctx[0]);
    			}

    			if (dirty & /*width*/ 2) {
    				attr_dev(img, "width", /*width*/ ctx[1]);
    			}

    			if (dirty & /*height*/ 4) {
    				attr_dev(img, "height", /*height*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(31:22) ",
    		ctx
    	});

    	return block;
    }

    // (29:2) {#if loaded}
    function create_if_block$3(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", /*className*/ ctx[5]);
    			if (img.src !== (img_src_value = /*src*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alt*/ ctx[0]);
    			attr_dev(img, "width", /*width*/ ctx[1]);
    			attr_dev(img, "height", /*height*/ ctx[2]);
    			add_location(img, file$4, 29, 4, 609);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*className*/ 32) {
    				attr_dev(img, "class", /*className*/ ctx[5]);
    			}

    			if (dirty & /*src*/ 8 && img.src !== (img_src_value = /*src*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*alt*/ 1) {
    				attr_dev(img, "alt", /*alt*/ ctx[0]);
    			}

    			if (dirty & /*width*/ 2) {
    				attr_dev(img, "width", /*width*/ ctx[1]);
    			}

    			if (dirty & /*height*/ 4) {
    				attr_dev(img, "height", /*height*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(29:2) {#if loaded}",
    		ctx
    	});

    	return block;
    }

    // (28:0) <Waypoint class={className} once on:enter={load} style="height: {height}px" offset="0">
    function create_default_slot$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_if_block_1$2, create_if_block_2$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[6]) return 0;
    		if (/*thumbnail*/ ctx[4]) return 1;
    		if (/*loading*/ ctx[7]) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(28:0) <Waypoint class={className} once on:enter={load} style=\\\"height: {height}px\\\" offset=\\\"0\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let current;

    	const waypoint = new Waypoint({
    			props: {
    				class: /*className*/ ctx[5],
    				once: true,
    				style: "height: " + /*height*/ ctx[2] + "px",
    				offset: "0",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	waypoint.$on("enter", /*load*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(waypoint.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(waypoint, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const waypoint_changes = {};
    			if (dirty & /*className*/ 32) waypoint_changes.class = /*className*/ ctx[5];
    			if (dirty & /*height*/ 4) waypoint_changes.style = "height: " + /*height*/ ctx[2] + "px";

    			if (dirty & /*$$scope, className, src, alt, width, height, loaded, thumbnail, loading*/ 1279) {
    				waypoint_changes.$$scope = { dirty, ctx };
    			}

    			waypoint.$set(waypoint_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(waypoint.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(waypoint.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(waypoint, detaching);
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
    	let { alt = "" } = $$props;
    	let { width = "" } = $$props;
    	let { height = "" } = $$props;
    	let { src = "" } = $$props;
    	let { thumbnail = "" } = $$props;
    	let { class: className = "" } = $$props;
    	let loaded = false;
    	let loading = false;

    	function load() {
    		const img = new Image();
    		img.src = src;
    		$$invalidate(7, loading = true);

    		img.onload = () => {
    			$$invalidate(7, loading = false);
    			$$invalidate(6, loaded = true);
    		};
    	}

    	const writable_props = ["alt", "width", "height", "src", "thumbnail", "class"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Image", $$slots, ['loading']);

    	$$self.$set = $$props => {
    		if ("alt" in $$props) $$invalidate(0, alt = $$props.alt);
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("src" in $$props) $$invalidate(3, src = $$props.src);
    		if ("thumbnail" in $$props) $$invalidate(4, thumbnail = $$props.thumbnail);
    		if ("class" in $$props) $$invalidate(5, className = $$props.class);
    		if ("$$scope" in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Waypoint,
    		fade,
    		alt,
    		width,
    		height,
    		src,
    		thumbnail,
    		className,
    		loaded,
    		loading,
    		load
    	});

    	$$self.$inject_state = $$props => {
    		if ("alt" in $$props) $$invalidate(0, alt = $$props.alt);
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("src" in $$props) $$invalidate(3, src = $$props.src);
    		if ("thumbnail" in $$props) $$invalidate(4, thumbnail = $$props.thumbnail);
    		if ("className" in $$props) $$invalidate(5, className = $$props.className);
    		if ("loaded" in $$props) $$invalidate(6, loaded = $$props.loaded);
    		if ("loading" in $$props) $$invalidate(7, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		alt,
    		width,
    		height,
    		src,
    		thumbnail,
    		className,
    		loaded,
    		loading,
    		load,
    		$$slots,
    		$$scope
    	];
    }

    class Image_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			alt: 0,
    			width: 1,
    			height: 2,
    			src: 3,
    			thumbnail: 4,
    			class: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image_1",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get alt() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alt(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get src() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get thumbnail() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set thumbnail(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/smelte/src/components/Ripple/Ripple.svelte generated by Svelte v3.21.0 */
    const file$5 = "node_modules/smelte/src/components/Ripple/Ripple.svelte";

    function create_fragment$5(ctx) {
    	let span;
    	let span_class_value;
    	let ripple_action;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", span_class_value = "z-40 " + /*className*/ ctx[1] + " rounded-full flex items-center justify-center top-0 left-0 " + (/*noHover*/ ctx[0] ? "" : /*hoverClass*/ ctx[3]) + " svelte-1umz44j");
    			add_location(span, file$5, 18, 0, 753);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;
    			if (remount) dispose();
    			dispose = action_destroyer(ripple_action = /*ripple*/ ctx[2].call(null, span));
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[5], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null));
    				}
    			}

    			if (!current || dirty & /*className, noHover, hoverClass*/ 11 && span_class_value !== (span_class_value = "z-40 " + /*className*/ ctx[1] + " rounded-full flex items-center justify-center top-0 left-0 " + (/*noHover*/ ctx[0] ? "" : /*hoverClass*/ ctx[3]) + " svelte-1umz44j")) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			dispose();
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
    	let { color = "primary" } = $$props;
    	let { noHover = false } = $$props;
    	let { class: className = "p-2" } = $$props;
    	const writable_props = ["color", "noHover", "class"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Ripple> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Ripple", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("color" in $$props) $$invalidate(4, color = $$props.color);
    		if ("noHover" in $$props) $$invalidate(0, noHover = $$props.noHover);
    		if ("class" in $$props) $$invalidate(1, className = $$props.class);
    		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		color,
    		noHover,
    		createRipple: r,
    		className,
    		ripple,
    		hoverClass
    	});

    	$$self.$inject_state = $$props => {
    		if ("color" in $$props) $$invalidate(4, color = $$props.color);
    		if ("noHover" in $$props) $$invalidate(0, noHover = $$props.noHover);
    		if ("className" in $$props) $$invalidate(1, className = $$props.className);
    		if ("ripple" in $$props) $$invalidate(2, ripple = $$props.ripple);
    		if ("hoverClass" in $$props) $$invalidate(3, hoverClass = $$props.hoverClass);
    	};

    	let ripple;
    	let hoverClass;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*color*/ 16) {
    			 $$invalidate(2, ripple = r(color, true));
    		}

    		if ($$self.$$.dirty & /*color*/ 16) {
    			 $$invalidate(3, hoverClass = `hover:bg-${color}-transLight`);
    		}
    	};

    	return [noHover, className, ripple, hoverClass, color, $$scope, $$slots];
    }

    class Ripple extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { color: 4, noHover: 0, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ripple",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get color() {
    		throw new Error("<Ripple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Ripple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noHover() {
    		throw new Error("<Ripple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noHover(value) {
    		throw new Error("<Ripple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Ripple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Ripple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/smelte/src/components/ProgressLinear/ProgressLinear.svelte generated by Svelte v3.21.0 */
    const file$6 = "node_modules/smelte/src/components/ProgressLinear/ProgressLinear.svelte";

    function create_fragment$6(ctx) {
    	let div2;
    	let div0;
    	let div0_class_value;
    	let div0_style_value;
    	let t;
    	let div1;
    	let div1_class_value;
    	let div2_class_value;
    	let div2_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", div0_class_value = "bg-" + /*color*/ ctx[2] + "-500 h-1 absolute" + " svelte-1fd39f9");

    			attr_dev(div0, "style", div0_style_value = /*progress*/ ctx[1]
    			? `width: ${/*progress*/ ctx[1]}%`
    			: "");

    			toggle_class(div0, "inc", !/*progress*/ ctx[1]);
    			toggle_class(div0, "transition", /*progress*/ ctx[1]);
    			add_location(div0, file$6, 87, 2, 2733);
    			attr_dev(div1, "class", div1_class_value = "bg-" + /*color*/ ctx[2] + "-500 h-1 absolute dec" + " svelte-1fd39f9");
    			toggle_class(div1, "hidden", /*progress*/ ctx[1]);
    			add_location(div1, file$6, 92, 2, 2891);
    			attr_dev(div2, "class", div2_class_value = "top-0 left-0 w-full h-1 bg-" + /*color*/ ctx[2] + "-100 overflow-hidden relative" + " svelte-1fd39f9");
    			toggle_class(div2, "fixed", /*app*/ ctx[0]);
    			toggle_class(div2, "z-50", /*app*/ ctx[0]);
    			toggle_class(div2, "hidden", /*app*/ ctx[0] && !/*initialized*/ ctx[3]);
    			add_location(div2, file$6, 81, 0, 2536);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*color*/ 4 && div0_class_value !== (div0_class_value = "bg-" + /*color*/ ctx[2] + "-500 h-1 absolute" + " svelte-1fd39f9")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty & /*progress*/ 2 && div0_style_value !== (div0_style_value = /*progress*/ ctx[1]
    			? `width: ${/*progress*/ ctx[1]}%`
    			: "")) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (dirty & /*color, progress*/ 6) {
    				toggle_class(div0, "inc", !/*progress*/ ctx[1]);
    			}

    			if (dirty & /*color, progress*/ 6) {
    				toggle_class(div0, "transition", /*progress*/ ctx[1]);
    			}

    			if (!current || dirty & /*color*/ 4 && div1_class_value !== (div1_class_value = "bg-" + /*color*/ ctx[2] + "-500 h-1 absolute dec" + " svelte-1fd39f9")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*color, progress*/ 6) {
    				toggle_class(div1, "hidden", /*progress*/ ctx[1]);
    			}

    			if (!current || dirty & /*color*/ 4 && div2_class_value !== (div2_class_value = "top-0 left-0 w-full h-1 bg-" + /*color*/ ctx[2] + "-100 overflow-hidden relative" + " svelte-1fd39f9")) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (dirty & /*color, app*/ 5) {
    				toggle_class(div2, "fixed", /*app*/ ctx[0]);
    			}

    			if (dirty & /*color, app*/ 5) {
    				toggle_class(div2, "z-50", /*app*/ ctx[0]);
    			}

    			if (dirty & /*color, app, initialized*/ 13) {
    				toggle_class(div2, "hidden", /*app*/ ctx[0] && !/*initialized*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, slide, { duration: 300 }, true);
    				div2_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, slide, { duration: 300 }, false);
    			div2_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching && div2_transition) div2_transition.end();
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
    	let { app = false } = $$props;
    	let { progress = 0 } = $$props;
    	let { color = "primary" } = $$props;
    	let initialized = false;

    	onMount(() => {
    		if (!app) return;

    		setTimeout(
    			() => {
    				$$invalidate(3, initialized = true);
    			},
    			200
    		);
    	});

    	const writable_props = ["app", "progress", "color"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ProgressLinear> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ProgressLinear", $$slots, []);

    	$$self.$set = $$props => {
    		if ("app" in $$props) $$invalidate(0, app = $$props.app);
    		if ("progress" in $$props) $$invalidate(1, progress = $$props.progress);
    		if ("color" in $$props) $$invalidate(2, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		slide,
    		app,
    		progress,
    		color,
    		initialized
    	});

    	$$self.$inject_state = $$props => {
    		if ("app" in $$props) $$invalidate(0, app = $$props.app);
    		if ("progress" in $$props) $$invalidate(1, progress = $$props.progress);
    		if ("color" in $$props) $$invalidate(2, color = $$props.color);
    		if ("initialized" in $$props) $$invalidate(3, initialized = $$props.initialized);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [app, progress, color, initialized];
    }

    class ProgressLinear extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { app: 0, progress: 1, color: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProgressLinear",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get app() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set app(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get progress() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set progress(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/smelte/src/components/Switch/Switch.svelte generated by Svelte v3.21.0 */
    const file$7 = "node_modules/smelte/src/components/Switch/Switch.svelte";

    // (63:4) <Ripple color={value && !disabled ? color : 'gray'} noHover>
    function create_default_slot$3(ctx) {
    	let div;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", /*th*/ ctx[6]);
    			attr_dev(div, "style", div_style_value = /*value*/ ctx[0] ? "left: 1.25rem" : "");
    			add_location(div, file$7, 63, 6, 1959);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*th*/ 64) {
    				attr_dev(div, "class", /*th*/ ctx[6]);
    			}

    			if (dirty & /*value*/ 1 && div_style_value !== (div_style_value = /*value*/ ctx[0] ? "left: 1.25rem" : "")) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(63:4) <Ripple color={value && !disabled ? color : 'gray'} noHover>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div2;
    	let input;
    	let t0;
    	let div1;
    	let div0;
    	let t1;
    	let t2;
    	let label_1;
    	let t3;
    	let current;
    	let dispose;

    	const ripple = new Ripple({
    			props: {
    				color: /*value*/ ctx[0] && !/*disabled*/ ctx[3]
    				? /*color*/ ctx[2]
    				: "gray",
    				noHover: true,
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			input = element("input");
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t1 = space();
    			create_component(ripple.$$.fragment);
    			t2 = space();
    			label_1 = element("label");
    			t3 = text(/*label*/ ctx[1]);
    			attr_dev(input, "class", "hidden");
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$7, 59, 2, 1764);
    			attr_dev(div0, "class", "w-full h-full absolute");
    			add_location(div0, file$7, 61, 4, 1849);
    			attr_dev(div1, "class", /*tr*/ ctx[5]);
    			add_location(div1, file$7, 60, 2, 1828);
    			attr_dev(label_1, "aria-hidden", "true");
    			attr_dev(label_1, "class", /*l*/ ctx[7]);
    			add_location(label_1, file$7, 68, 2, 2056);
    			attr_dev(div2, "class", /*c*/ ctx[4]);
    			add_location(div2, file$7, 58, 0, 1729);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, input);
    			set_input_value(input, /*value*/ ctx[0]);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			mount_component(ripple, div1, null);
    			append_dev(div2, t2);
    			append_dev(div2, label_1);
    			append_dev(label_1, t3);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "change", /*input_change_handler*/ ctx[20]),
    				listen_dev(input, "change", /*change_handler*/ ctx[19], false, false, false),
    				listen_dev(div2, "click", /*check*/ ctx[8], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			const ripple_changes = {};

    			if (dirty & /*value, disabled, color*/ 13) ripple_changes.color = /*value*/ ctx[0] && !/*disabled*/ ctx[3]
    			? /*color*/ ctx[2]
    			: "gray";

    			if (dirty & /*$$scope, th, value*/ 2097217) {
    				ripple_changes.$$scope = { dirty, ctx };
    			}

    			ripple.$set(ripple_changes);

    			if (!current || dirty & /*tr*/ 32) {
    				attr_dev(div1, "class", /*tr*/ ctx[5]);
    			}

    			if (!current || dirty & /*label*/ 2) set_data_dev(t3, /*label*/ ctx[1]);

    			if (!current || dirty & /*l*/ 128) {
    				attr_dev(label_1, "class", /*l*/ ctx[7]);
    			}

    			if (!current || dirty & /*c*/ 16) {
    				attr_dev(div2, "class", /*c*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ripple.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ripple.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(ripple);
    			run_all(dispose);
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

    const trackClassesDefault = "relative w-10 h-auto z-0 rounded-full overflow-visible flex items-center justify-center";
    const thumbClassesDefault = "rounded-full p-2 w-5 h-5 absolute elevation-3 transition-fast";
    const labelClassesDefault = "pl-2 cursor-pointer";

    function instance$7($$self, $$props, $$invalidate) {
    	const classesDefault = `inline-flex items-center mb-2 cursor-pointer z-10`;
    	let { value = false } = $$props;
    	let { label = "" } = $$props;
    	let { color = "primary" } = $$props;
    	let { disabled = false } = $$props;
    	let { trackClasses = trackClassesDefault } = $$props;
    	let { thumbClasses = thumbClassesDefault } = $$props;
    	let { labelClasses = labelClassesDefault } = $$props;
    	let { class: className = "" } = $$props;
    	let { classes = classesDefault } = $$props;
    	const cb = new ClassBuilder(classes, classesDefault);
    	const trcb = new ClassBuilder(trackClasses, trackClassesDefault);
    	const thcb = new ClassBuilder(thumbClasses, thumbClassesDefault);
    	const lcb = new ClassBuilder(labelClasses, labelClassesDefault);

    	function check() {
    		if (disabled) return;
    		$$invalidate(0, value = !value);
    	}

    	const writable_props = [
    		"value",
    		"label",
    		"color",
    		"disabled",
    		"trackClasses",
    		"thumbClasses",
    		"labelClasses",
    		"class",
    		"classes"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Switch> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Switch", $$slots, []);

    	function change_handler(event) {
    		bubble($$self, event);
    	}

    	function input_change_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("label" in $$props) $$invalidate(1, label = $$props.label);
    		if ("color" in $$props) $$invalidate(2, color = $$props.color);
    		if ("disabled" in $$props) $$invalidate(3, disabled = $$props.disabled);
    		if ("trackClasses" in $$props) $$invalidate(9, trackClasses = $$props.trackClasses);
    		if ("thumbClasses" in $$props) $$invalidate(10, thumbClasses = $$props.thumbClasses);
    		if ("labelClasses" in $$props) $$invalidate(11, labelClasses = $$props.labelClasses);
    		if ("class" in $$props) $$invalidate(12, className = $$props.class);
    		if ("classes" in $$props) $$invalidate(13, classes = $$props.classes);
    	};

    	$$self.$capture_state = () => ({
    		Ripple,
    		ClassBuilder,
    		classesDefault,
    		trackClassesDefault,
    		thumbClassesDefault,
    		labelClassesDefault,
    		value,
    		label,
    		color,
    		disabled,
    		trackClasses,
    		thumbClasses,
    		labelClasses,
    		className,
    		classes,
    		cb,
    		trcb,
    		thcb,
    		lcb,
    		check,
    		c,
    		tr,
    		th,
    		l
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("label" in $$props) $$invalidate(1, label = $$props.label);
    		if ("color" in $$props) $$invalidate(2, color = $$props.color);
    		if ("disabled" in $$props) $$invalidate(3, disabled = $$props.disabled);
    		if ("trackClasses" in $$props) $$invalidate(9, trackClasses = $$props.trackClasses);
    		if ("thumbClasses" in $$props) $$invalidate(10, thumbClasses = $$props.thumbClasses);
    		if ("labelClasses" in $$props) $$invalidate(11, labelClasses = $$props.labelClasses);
    		if ("className" in $$props) $$invalidate(12, className = $$props.className);
    		if ("classes" in $$props) $$invalidate(13, classes = $$props.classes);
    		if ("c" in $$props) $$invalidate(4, c = $$props.c);
    		if ("tr" in $$props) $$invalidate(5, tr = $$props.tr);
    		if ("th" in $$props) $$invalidate(6, th = $$props.th);
    		if ("l" in $$props) $$invalidate(7, l = $$props.l);
    	};

    	let c;
    	let tr;
    	let th;
    	let l;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*classes, className*/ 12288) {
    			 $$invalidate(4, c = cb.flush().add(classes, true, classesDefault).add(className).get());
    		}

    		if ($$self.$$.dirty & /*value, color, trackClasses*/ 517) {
    			 $$invalidate(5, tr = trcb.flush().add("bg-gray-700", !value).add(`bg-${color}-200`, value).add(trackClasses, true, trackClassesDefault).get());
    		}

    		if ($$self.$$.dirty & /*thumbClasses, value, color*/ 1029) {
    			 $$invalidate(6, th = thcb.flush().add(thumbClasses, true, thumbClassesDefault).add("bg-white left-0", !value).add(`bg-${color}-400`, value).get());
    		}

    		if ($$self.$$.dirty & /*labelClasses, disabled*/ 2056) {
    			 $$invalidate(7, l = lcb.flush().add(labelClasses, true, labelClassesDefault).add("text-gray-500", disabled).add("text-gray-700", !disabled).get());
    		}
    	};

    	return [
    		value,
    		label,
    		color,
    		disabled,
    		c,
    		tr,
    		th,
    		l,
    		check,
    		trackClasses,
    		thumbClasses,
    		labelClasses,
    		className,
    		classes,
    		classesDefault,
    		cb,
    		trcb,
    		thcb,
    		lcb,
    		change_handler,
    		input_change_handler
    	];
    }

    class Switch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			value: 0,
    			label: 1,
    			color: 2,
    			disabled: 3,
    			trackClasses: 9,
    			thumbClasses: 10,
    			labelClasses: 11,
    			class: 12,
    			classes: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Switch",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get value() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trackClasses() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trackClasses(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get thumbClasses() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set thumbClasses(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelClasses() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelClasses(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classes() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classes(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/smelte/src/components/Tooltip/Tooltip.svelte generated by Svelte v3.21.0 */
    const file$8 = "node_modules/smelte/src/components/Tooltip/Tooltip.svelte";
    const get_activator_slot_changes = dirty => ({});
    const get_activator_slot_context = ctx => ({});

    // (78:2) {#if show}
    function create_if_block$4(ctx) {
    	let div;
    	let div_class_value;
    	let div_intro;
    	let div_outro;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*c*/ ctx[1]) + " svelte-8k3hzo"));
    			add_location(div, file$8, 78, 4, 2182);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[8], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null));
    				}
    			}

    			if (!current || dirty & /*c*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(/*c*/ ctx[1]) + " svelte-8k3hzo"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				if (!div_intro) div_intro = create_in_transition(div, scale, { duration: 150 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, scale, { duration: 150, delay: 100 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(78:2) {#if show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let current;
    	let dispose;
    	const activator_slot_template = /*$$slots*/ ctx[9].activator;
    	const activator_slot = create_slot(activator_slot_template, ctx, /*$$scope*/ ctx[8], get_activator_slot_context);
    	let if_block = /*show*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (activator_slot) activator_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			add_location(div0, file$8, 66, 2, 1953);
    			attr_dev(div1, "class", "relative inline-block");
    			add_location(div1, file$8, 65, 0, 1915);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (activator_slot) {
    				activator_slot.m(div0, null);
    			}

    			append_dev(div1, t);
    			if (if_block) if_block.m(div1, null);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(div0, "mouseenter", debounce(/*showTooltip*/ ctx[2], 100), false, false, false),
    				listen_dev(div0, "mouseleave", debounce(/*hideTooltip*/ ctx[3], 500), false, false, false),
    				listen_dev(div0, "mouseenter", /*mouseenter_handler*/ ctx[10], false, false, false),
    				listen_dev(div0, "mouseleave", /*mouseleave_handler*/ ctx[11], false, false, false),
    				listen_dev(div0, "mouseover", /*mouseover_handler*/ ctx[12], false, false, false),
    				listen_dev(div0, "mouseout", /*mouseout_handler*/ ctx[13], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (activator_slot) {
    				if (activator_slot.p && dirty & /*$$scope*/ 256) {
    					activator_slot.p(get_slot_context(activator_slot_template, ctx, /*$$scope*/ ctx[8], get_activator_slot_context), get_slot_changes(activator_slot_template, /*$$scope*/ ctx[8], dirty, get_activator_slot_changes));
    				}
    			}

    			if (/*show*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*show*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(activator_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(activator_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (activator_slot) activator_slot.d(detaching);
    			if (if_block) if_block.d();
    			run_all(dispose);
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

    const classesDefault$1 = "tooltip whitespace-no-wrap text-xs absolute mt-2 bg-gray-600 text-gray-50 rounded md:px-2 md:py-2 py-4 px-3 z-30";

    function debounce(func, wait, immediate) {
    	let timeout;

    	return function () {
    		let context = this, args = arguments;

    		let later = function () {
    			timeout = null;
    			if (!immediate) func.apply(context, args);
    		};

    		let callNow = immediate && !timeout;
    		clearTimeout(timeout);
    		timeout = setTimeout(later, wait);
    		if (callNow) func.apply(context, args);
    	};
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { classes = classesDefault$1 } = $$props;
    	let { show = false } = $$props;
    	let { timeout = null } = $$props;
    	const cb = new ClassBuilder(classes, classesDefault$1);

    	function showTooltip() {
    		if (show) return;
    		$$invalidate(0, show = true);
    		if (!timeout) return;

    		$$invalidate(4, timeout = setTimeout(
    			() => {
    				$$invalidate(0, show = false);
    			},
    			timeout
    		));
    	}

    	function hideTooltip() {
    		if (!show) return;
    		$$invalidate(0, show = false);
    		clearTimeout(timeout);
    	}

    	const writable_props = ["class", "classes", "show", "timeout"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tooltip> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Tooltip", $$slots, ['activator','default']);

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseout_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("class" in $$props) $$invalidate(5, className = $$props.class);
    		if ("classes" in $$props) $$invalidate(6, classes = $$props.classes);
    		if ("show" in $$props) $$invalidate(0, show = $$props.show);
    		if ("timeout" in $$props) $$invalidate(4, timeout = $$props.timeout);
    		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		scale,
    		fade,
    		ClassBuilder,
    		classesDefault: classesDefault$1,
    		className,
    		classes,
    		show,
    		timeout,
    		cb,
    		showTooltip,
    		hideTooltip,
    		debounce,
    		c
    	});

    	$$self.$inject_state = $$props => {
    		if ("className" in $$props) $$invalidate(5, className = $$props.className);
    		if ("classes" in $$props) $$invalidate(6, classes = $$props.classes);
    		if ("show" in $$props) $$invalidate(0, show = $$props.show);
    		if ("timeout" in $$props) $$invalidate(4, timeout = $$props.timeout);
    		if ("c" in $$props) $$invalidate(1, c = $$props.c);
    	};

    	let c;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*classes, className*/ 96) {
    			 $$invalidate(1, c = cb.flush().add(classes, true, classesDefault$1).add(className).get());
    		}
    	};

    	return [
    		show,
    		c,
    		showTooltip,
    		hideTooltip,
    		timeout,
    		className,
    		classes,
    		cb,
    		$$scope,
    		$$slots,
    		mouseenter_handler,
    		mouseleave_handler,
    		mouseover_handler,
    		mouseout_handler
    	];
    }

    class Tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			class: 5,
    			classes: 6,
    			show: 0,
    			timeout: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get class() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classes() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classes(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get show() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get timeout() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set timeout(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/avatar/Avatar.svelte generated by Svelte v3.21.0 */
    const file$9 = "src/components/avatar/Avatar.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let div_class_value;
    	let current;

    	const image = new Image_1({
    			props: {
    				alt: /*alt*/ ctx[2],
    				src: /*src*/ ctx[3],
    				class: "rounded-full",
    				width: /*widthHeight*/ ctx[1],
    				height: /*widthHeight*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(image.$$.fragment);
    			attr_dev(div, "class", div_class_value = "avatar " + /*avatarClass*/ ctx[0]);
    			add_location(div, file$9, 8, 0, 163);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(image, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const image_changes = {};
    			if (dirty & /*widthHeight*/ 2) image_changes.width = /*widthHeight*/ ctx[1];
    			if (dirty & /*widthHeight*/ 2) image_changes.height = /*widthHeight*/ ctx[1];
    			image.$set(image_changes);

    			if (!current || dirty & /*avatarClass*/ 1 && div_class_value !== (div_class_value = "avatar " + /*avatarClass*/ ctx[0])) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(image.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(image.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(image);
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
    	let { avatar = {} } = $$props;
    	let { avatarClass } = $$props;
    	let { widthHeight } = $$props;
    	const { alt, src } = avatar;
    	const writable_props = ["avatar", "avatarClass", "widthHeight"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Avatar> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Avatar", $$slots, []);

    	$$self.$set = $$props => {
    		if ("avatar" in $$props) $$invalidate(4, avatar = $$props.avatar);
    		if ("avatarClass" in $$props) $$invalidate(0, avatarClass = $$props.avatarClass);
    		if ("widthHeight" in $$props) $$invalidate(1, widthHeight = $$props.widthHeight);
    	};

    	$$self.$capture_state = () => ({
    		Image: Image_1,
    		avatar,
    		avatarClass,
    		widthHeight,
    		alt,
    		src
    	});

    	$$self.$inject_state = $$props => {
    		if ("avatar" in $$props) $$invalidate(4, avatar = $$props.avatar);
    		if ("avatarClass" in $$props) $$invalidate(0, avatarClass = $$props.avatarClass);
    		if ("widthHeight" in $$props) $$invalidate(1, widthHeight = $$props.widthHeight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [avatarClass, widthHeight, alt, src, avatar];
    }

    class Avatar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			avatar: 4,
    			avatarClass: 0,
    			widthHeight: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Avatar",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*avatarClass*/ ctx[0] === undefined && !("avatarClass" in props)) {
    			console.warn("<Avatar> was created without expected prop 'avatarClass'");
    		}

    		if (/*widthHeight*/ ctx[1] === undefined && !("widthHeight" in props)) {
    			console.warn("<Avatar> was created without expected prop 'widthHeight'");
    		}
    	}

    	get avatar() {
    		throw new Error("<Avatar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set avatar(value) {
    		throw new Error("<Avatar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get avatarClass() {
    		throw new Error("<Avatar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set avatarClass(value) {
    		throw new Error("<Avatar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get widthHeight() {
    		throw new Error("<Avatar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set widthHeight(value) {
    		throw new Error("<Avatar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-awesome/components/svg/Path.svelte generated by Svelte v3.21.0 */

    const file$a = "node_modules/svelte-awesome/components/svg/Path.svelte";

    function create_fragment$a(ctx) {
    	let path;
    	let path_levels = [{ key: "path-" + /*id*/ ctx[0] }, /*data*/ ctx[1]];
    	let path_data = {};

    	for (let i = 0; i < path_levels.length; i += 1) {
    		path_data = assign(path_data, path_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			set_svg_attributes(path, path_data);
    			add_location(path, file$a, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(path, get_spread_update(path_levels, [
    				dirty & /*id*/ 1 && { key: "path-" + /*id*/ ctx[0] },
    				dirty & /*data*/ 2 && /*data*/ ctx[1]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
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
    	let { id = "" } = $$props;
    	let { data = {} } = $$props;
    	const writable_props = ["id", "data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Path> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Path", $$slots, []);

    	$$self.$set = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ id, data });

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, data];
    }

    class Path extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { id: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Path",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get id() {
    		throw new Error("<Path>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Path>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Path>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Path>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-awesome/components/svg/Polygon.svelte generated by Svelte v3.21.0 */

    const file$b = "node_modules/svelte-awesome/components/svg/Polygon.svelte";

    function create_fragment$b(ctx) {
    	let polygon;
    	let polygon_levels = [{ key: "polygon-" + /*id*/ ctx[0] }, /*data*/ ctx[1]];
    	let polygon_data = {};

    	for (let i = 0; i < polygon_levels.length; i += 1) {
    		polygon_data = assign(polygon_data, polygon_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			polygon = svg_element("polygon");
    			set_svg_attributes(polygon, polygon_data);
    			add_location(polygon, file$b, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, polygon, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(polygon, get_spread_update(polygon_levels, [
    				dirty & /*id*/ 1 && { key: "polygon-" + /*id*/ ctx[0] },
    				dirty & /*data*/ 2 && /*data*/ ctx[1]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(polygon);
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
    	let { id = "" } = $$props;
    	let { data = {} } = $$props;
    	const writable_props = ["id", "data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Polygon> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Polygon", $$slots, []);

    	$$self.$set = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ id, data });

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, data];
    }

    class Polygon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { id: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Polygon",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get id() {
    		throw new Error("<Polygon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Polygon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Polygon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Polygon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-awesome/components/svg/Raw.svelte generated by Svelte v3.21.0 */

    const file$c = "node_modules/svelte-awesome/components/svg/Raw.svelte";

    function create_fragment$c(ctx) {
    	let g;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			add_location(g, file$c, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			g.innerHTML = /*raw*/ ctx[0];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*raw*/ 1) g.innerHTML = /*raw*/ ctx[0];		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
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
    	let cursor = 870711;

    	function getId() {
    		cursor += 1;
    		return `fa-${cursor.toString(16)}`;
    	}

    	let raw;
    	let { data } = $$props;

    	function getRaw(data) {
    		if (!data || !data.raw) {
    			return null;
    		}

    		let rawData = data.raw;
    		const ids = {};

    		rawData = rawData.replace(/\s(?:xml:)?id=["']?([^"')\s]+)/g, (match, id) => {
    			const uniqueId = getId();
    			ids[id] = uniqueId;
    			return ` id="${uniqueId}"`;
    		});

    		rawData = rawData.replace(/#(?:([^'")\s]+)|xpointer\(id\((['"]?)([^')]+)\2\)\))/g, (match, rawId, _, pointerId) => {
    			const id = rawId || pointerId;

    			if (!id || !ids[id]) {
    				return match;
    			}

    			return `#${ids[id]}`;
    		});

    		return rawData;
    	}

    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Raw> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Raw", $$slots, []);

    	$$self.$set = $$props => {
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ cursor, getId, raw, data, getRaw });

    	$$self.$inject_state = $$props => {
    		if ("cursor" in $$props) cursor = $$props.cursor;
    		if ("raw" in $$props) $$invalidate(0, raw = $$props.raw);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data*/ 2) {
    			 $$invalidate(0, raw = getRaw(data));
    		}
    	};

    	return [raw, data];
    }

    class Raw extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Raw",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[1] === undefined && !("data" in props)) {
    			console.warn("<Raw> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<Raw>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Raw>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-awesome/components/svg/Svg.svelte generated by Svelte v3.21.0 */

    const file$d = "node_modules/svelte-awesome/components/svg/Svg.svelte";

    function create_fragment$d(ctx) {
    	let svg;
    	let svg_class_value;
    	let svg_role_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (default_slot) default_slot.c();
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "class", svg_class_value = "fa-icon " + /*className*/ ctx[0] + " svelte-ieu2dh");
    			attr_dev(svg, "x", /*x*/ ctx[8]);
    			attr_dev(svg, "y", /*y*/ ctx[9]);
    			attr_dev(svg, "width", /*width*/ ctx[1]);
    			attr_dev(svg, "height", /*height*/ ctx[2]);
    			attr_dev(svg, "aria-label", /*label*/ ctx[11]);
    			attr_dev(svg, "role", svg_role_value = /*label*/ ctx[11] ? "img" : "presentation");
    			attr_dev(svg, "viewBox", /*box*/ ctx[3]);
    			attr_dev(svg, "style", /*style*/ ctx[10]);
    			toggle_class(svg, "fa-spin", /*spin*/ ctx[4]);
    			toggle_class(svg, "fa-pulse", /*pulse*/ ctx[6]);
    			toggle_class(svg, "fa-inverse", /*inverse*/ ctx[5]);
    			toggle_class(svg, "fa-flip-horizontal", /*flip*/ ctx[7] === "horizontal");
    			toggle_class(svg, "fa-flip-vertical", /*flip*/ ctx[7] === "vertical");
    			add_location(svg, file$d, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);

    			if (default_slot) {
    				default_slot.m(svg, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[12], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null));
    				}
    			}

    			if (!current || dirty & /*className*/ 1 && svg_class_value !== (svg_class_value = "fa-icon " + /*className*/ ctx[0] + " svelte-ieu2dh")) {
    				attr_dev(svg, "class", svg_class_value);
    			}

    			if (!current || dirty & /*x*/ 256) {
    				attr_dev(svg, "x", /*x*/ ctx[8]);
    			}

    			if (!current || dirty & /*y*/ 512) {
    				attr_dev(svg, "y", /*y*/ ctx[9]);
    			}

    			if (!current || dirty & /*width*/ 2) {
    				attr_dev(svg, "width", /*width*/ ctx[1]);
    			}

    			if (!current || dirty & /*height*/ 4) {
    				attr_dev(svg, "height", /*height*/ ctx[2]);
    			}

    			if (!current || dirty & /*label*/ 2048) {
    				attr_dev(svg, "aria-label", /*label*/ ctx[11]);
    			}

    			if (!current || dirty & /*label*/ 2048 && svg_role_value !== (svg_role_value = /*label*/ ctx[11] ? "img" : "presentation")) {
    				attr_dev(svg, "role", svg_role_value);
    			}

    			if (!current || dirty & /*box*/ 8) {
    				attr_dev(svg, "viewBox", /*box*/ ctx[3]);
    			}

    			if (!current || dirty & /*style*/ 1024) {
    				attr_dev(svg, "style", /*style*/ ctx[10]);
    			}

    			if (dirty & /*className, spin*/ 17) {
    				toggle_class(svg, "fa-spin", /*spin*/ ctx[4]);
    			}

    			if (dirty & /*className, pulse*/ 65) {
    				toggle_class(svg, "fa-pulse", /*pulse*/ ctx[6]);
    			}

    			if (dirty & /*className, inverse*/ 33) {
    				toggle_class(svg, "fa-inverse", /*inverse*/ ctx[5]);
    			}

    			if (dirty & /*className, flip*/ 129) {
    				toggle_class(svg, "fa-flip-horizontal", /*flip*/ ctx[7] === "horizontal");
    			}

    			if (dirty & /*className, flip*/ 129) {
    				toggle_class(svg, "fa-flip-vertical", /*flip*/ ctx[7] === "vertical");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { class: className } = $$props;
    	let { width } = $$props;
    	let { height } = $$props;
    	let { box } = $$props;
    	let { spin = false } = $$props;
    	let { inverse = false } = $$props;
    	let { pulse = false } = $$props;
    	let { flip = null } = $$props;
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { style = undefined } = $$props;
    	let { label = undefined } = $$props;

    	const writable_props = [
    		"class",
    		"width",
    		"height",
    		"box",
    		"spin",
    		"inverse",
    		"pulse",
    		"flip",
    		"x",
    		"y",
    		"style",
    		"label"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Svg> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Svg", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("class" in $$props) $$invalidate(0, className = $$props.class);
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("box" in $$props) $$invalidate(3, box = $$props.box);
    		if ("spin" in $$props) $$invalidate(4, spin = $$props.spin);
    		if ("inverse" in $$props) $$invalidate(5, inverse = $$props.inverse);
    		if ("pulse" in $$props) $$invalidate(6, pulse = $$props.pulse);
    		if ("flip" in $$props) $$invalidate(7, flip = $$props.flip);
    		if ("x" in $$props) $$invalidate(8, x = $$props.x);
    		if ("y" in $$props) $$invalidate(9, y = $$props.y);
    		if ("style" in $$props) $$invalidate(10, style = $$props.style);
    		if ("label" in $$props) $$invalidate(11, label = $$props.label);
    		if ("$$scope" in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		width,
    		height,
    		box,
    		spin,
    		inverse,
    		pulse,
    		flip,
    		x,
    		y,
    		style,
    		label
    	});

    	$$self.$inject_state = $$props => {
    		if ("className" in $$props) $$invalidate(0, className = $$props.className);
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("box" in $$props) $$invalidate(3, box = $$props.box);
    		if ("spin" in $$props) $$invalidate(4, spin = $$props.spin);
    		if ("inverse" in $$props) $$invalidate(5, inverse = $$props.inverse);
    		if ("pulse" in $$props) $$invalidate(6, pulse = $$props.pulse);
    		if ("flip" in $$props) $$invalidate(7, flip = $$props.flip);
    		if ("x" in $$props) $$invalidate(8, x = $$props.x);
    		if ("y" in $$props) $$invalidate(9, y = $$props.y);
    		if ("style" in $$props) $$invalidate(10, style = $$props.style);
    		if ("label" in $$props) $$invalidate(11, label = $$props.label);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		className,
    		width,
    		height,
    		box,
    		spin,
    		inverse,
    		pulse,
    		flip,
    		x,
    		y,
    		style,
    		label,
    		$$scope,
    		$$slots
    	];
    }

    class Svg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			class: 0,
    			width: 1,
    			height: 2,
    			box: 3,
    			spin: 4,
    			inverse: 5,
    			pulse: 6,
    			flip: 7,
    			x: 8,
    			y: 9,
    			style: 10,
    			label: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Svg",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*className*/ ctx[0] === undefined && !("class" in props)) {
    			console.warn("<Svg> was created without expected prop 'class'");
    		}

    		if (/*width*/ ctx[1] === undefined && !("width" in props)) {
    			console.warn("<Svg> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[2] === undefined && !("height" in props)) {
    			console.warn("<Svg> was created without expected prop 'height'");
    		}

    		if (/*box*/ ctx[3] === undefined && !("box" in props)) {
    			console.warn("<Svg> was created without expected prop 'box'");
    		}
    	}

    	get class() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get box() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set box(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pulse() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pulse(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flip() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flip(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-awesome/components/Icon.svelte generated by Svelte v3.21.0 */

    const { Object: Object_1, console: console_1 } = globals;

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	child_ctx[31] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[31] = i;
    	return child_ctx;
    }

    // (4:4) {#if self}
    function create_if_block$5(ctx) {
    	let t0;
    	let t1;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*self*/ ctx[0].paths && create_if_block_3(ctx);
    	let if_block1 = /*self*/ ctx[0].polygons && create_if_block_2$3(ctx);
    	let if_block2 = /*self*/ ctx[0].raw && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*self*/ ctx[0].paths) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*self*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*self*/ ctx[0].polygons) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*self*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*self*/ ctx[0].raw) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*self*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1$3(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(4:4) {#if self}",
    		ctx
    	});

    	return block;
    }

    // (5:6) {#if self.paths}
    function create_if_block_3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*self*/ ctx[0].paths;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*self*/ 1) {
    				each_value_1 = /*self*/ ctx[0].paths;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(5:6) {#if self.paths}",
    		ctx
    	});

    	return block;
    }

    // (6:8) {#each self.paths as path, i}
    function create_each_block_1(ctx) {
    	let current;

    	const path = new Path({
    			props: {
    				id: /*i*/ ctx[31],
    				data: /*path*/ ctx[32]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(path.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(path, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const path_changes = {};
    			if (dirty[0] & /*self*/ 1) path_changes.data = /*path*/ ctx[32];
    			path.$set(path_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(path.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(path.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(path, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(6:8) {#each self.paths as path, i}",
    		ctx
    	});

    	return block;
    }

    // (10:6) {#if self.polygons}
    function create_if_block_2$3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*self*/ ctx[0].polygons;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*self*/ 1) {
    				each_value = /*self*/ ctx[0].polygons;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(10:6) {#if self.polygons}",
    		ctx
    	});

    	return block;
    }

    // (11:8) {#each self.polygons as polygon, i}
    function create_each_block(ctx) {
    	let current;

    	const polygon = new Polygon({
    			props: {
    				id: /*i*/ ctx[31],
    				data: /*polygon*/ ctx[29]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(polygon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(polygon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const polygon_changes = {};
    			if (dirty[0] & /*self*/ 1) polygon_changes.data = /*polygon*/ ctx[29];
    			polygon.$set(polygon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(polygon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(polygon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(polygon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(11:8) {#each self.polygons as polygon, i}",
    		ctx
    	});

    	return block;
    }

    // (15:6) {#if self.raw}
    function create_if_block_1$3(ctx) {
    	let updating_data;
    	let current;

    	function raw_data_binding(value) {
    		/*raw_data_binding*/ ctx[27].call(null, value);
    	}

    	let raw_props = {};

    	if (/*self*/ ctx[0] !== void 0) {
    		raw_props.data = /*self*/ ctx[0];
    	}

    	const raw = new Raw({ props: raw_props, $$inline: true });
    	binding_callbacks.push(() => bind(raw, "data", raw_data_binding));

    	const block = {
    		c: function create() {
    			create_component(raw.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(raw, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const raw_changes = {};

    			if (!updating_data && dirty[0] & /*self*/ 1) {
    				updating_data = true;
    				raw_changes.data = /*self*/ ctx[0];
    				add_flush_callback(() => updating_data = false);
    			}

    			raw.$set(raw_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(raw.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(raw.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(raw, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(15:6) {#if self.raw}",
    		ctx
    	});

    	return block;
    }

    // (3:8)      
    function fallback_block(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*self*/ ctx[0] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*self*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*self*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(3:8)      ",
    		ctx
    	});

    	return block;
    }

    // (1:0) <Svg label={label} width={width} height={height} box={box} style={combinedStyle}   spin={spin} flip={flip} inverse={inverse} pulse={pulse} class={className}>
    function create_default_slot$4(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[28], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 268435456) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[28], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[28], dirty, null));
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty[0] & /*self*/ 1) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(1:0) <Svg label={label} width={width} height={height} box={box} style={combinedStyle}   spin={spin} flip={flip} inverse={inverse} pulse={pulse} class={className}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let current;

    	const svg = new Svg({
    			props: {
    				label: /*label*/ ctx[6],
    				width: /*width*/ ctx[7],
    				height: /*height*/ ctx[8],
    				box: /*box*/ ctx[10],
    				style: /*combinedStyle*/ ctx[9],
    				spin: /*spin*/ ctx[2],
    				flip: /*flip*/ ctx[5],
    				inverse: /*inverse*/ ctx[3],
    				pulse: /*pulse*/ ctx[4],
    				class: /*className*/ ctx[1],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svg.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(svg, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svg_changes = {};
    			if (dirty[0] & /*label*/ 64) svg_changes.label = /*label*/ ctx[6];
    			if (dirty[0] & /*width*/ 128) svg_changes.width = /*width*/ ctx[7];
    			if (dirty[0] & /*height*/ 256) svg_changes.height = /*height*/ ctx[8];
    			if (dirty[0] & /*box*/ 1024) svg_changes.box = /*box*/ ctx[10];
    			if (dirty[0] & /*combinedStyle*/ 512) svg_changes.style = /*combinedStyle*/ ctx[9];
    			if (dirty[0] & /*spin*/ 4) svg_changes.spin = /*spin*/ ctx[2];
    			if (dirty[0] & /*flip*/ 32) svg_changes.flip = /*flip*/ ctx[5];
    			if (dirty[0] & /*inverse*/ 8) svg_changes.inverse = /*inverse*/ ctx[3];
    			if (dirty[0] & /*pulse*/ 16) svg_changes.pulse = /*pulse*/ ctx[4];
    			if (dirty[0] & /*className*/ 2) svg_changes.class = /*className*/ ctx[1];

    			if (dirty[0] & /*$$scope, self*/ 268435457) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svg, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function normaliseData(data) {
    	if ("iconName" in data && "icon" in data) {
    		let normalisedData = {};
    		let faIcon = data.icon;
    		let name = data.iconName;
    		let width = faIcon[0];
    		let height = faIcon[1];
    		let paths = faIcon[4];
    		let iconData = { width, height, paths: [{ d: paths }] };
    		normalisedData[name] = iconData;
    		return normalisedData;
    	}

    	return data;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { data } = $$props;
    	let { scale = 1 } = $$props;
    	let { spin = false } = $$props;
    	let { inverse = false } = $$props;
    	let { pulse = false } = $$props;
    	let { flip = null } = $$props;
    	let { label = null } = $$props;
    	let { self = null } = $$props;
    	let { style = null } = $$props;

    	// internal
    	let x = 0;

    	let y = 0;
    	let childrenHeight = 0;
    	let childrenWidth = 0;
    	let outerScale = 1;
    	let width;
    	let height;
    	let combinedStyle;
    	let box;

    	function init() {
    		if (typeof data === "undefined") {
    			return;
    		}

    		const normalisedData = normaliseData(data);
    		const [name] = Object.keys(normalisedData);
    		const icon = normalisedData[name];

    		if (!icon.paths) {
    			icon.paths = [];
    		}

    		if (icon.d) {
    			icon.paths.push({ d: icon.d });
    		}

    		if (!icon.polygons) {
    			icon.polygons = [];
    		}

    		if (icon.points) {
    			icon.polygons.push({ points: icon.points });
    		}

    		$$invalidate(0, self = icon);
    	}

    	function normalisedScale() {
    		let numScale = 1;

    		if (typeof scale !== "undefined") {
    			numScale = Number(scale);
    		}

    		if (isNaN(numScale) || numScale <= 0) {
    			// eslint-disable-line no-restricted-globals
    			console.warn("Invalid prop: prop \"scale\" should be a number over 0."); // eslint-disable-line no-console

    			return outerScale;
    		}

    		return numScale * outerScale;
    	}

    	function calculateBox() {
    		if (self) {
    			return `0 0 ${self.width} ${self.height}`;
    		}

    		return `0 0 ${width} ${height}`;
    	}

    	function calculateRatio() {
    		if (!self) {
    			return 1;
    		}

    		return Math.max(self.width, self.height) / 16;
    	}

    	function calculateWidth() {
    		if (childrenWidth) {
    			return childrenWidth;
    		}

    		if (self) {
    			return self.width / calculateRatio() * normalisedScale();
    		}

    		return 0;
    	}

    	function calculateHeight() {
    		if (childrenHeight) {
    			return childrenHeight;
    		}

    		if (self) {
    			return self.height / calculateRatio() * normalisedScale();
    		}

    		return 0;
    	}

    	function calculateStyle() {
    		let combined = "";

    		if (style !== null) {
    			combined += style;
    		}

    		let size = normalisedScale();

    		if (size === 1) {
    			return combined;
    		}

    		if (combined !== "" && !combined.endsWith(";")) {
    			combined += "; ";
    		}

    		return `${combined}font-size: ${size}em`;
    	}

    	const writable_props = [
    		"class",
    		"data",
    		"scale",
    		"spin",
    		"inverse",
    		"pulse",
    		"flip",
    		"label",
    		"self",
    		"style"
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Icon", $$slots, ['default']);

    	function raw_data_binding(value) {
    		self = value;
    		$$invalidate(0, self);
    	}

    	$$self.$set = $$props => {
    		if ("class" in $$props) $$invalidate(1, className = $$props.class);
    		if ("data" in $$props) $$invalidate(11, data = $$props.data);
    		if ("scale" in $$props) $$invalidate(12, scale = $$props.scale);
    		if ("spin" in $$props) $$invalidate(2, spin = $$props.spin);
    		if ("inverse" in $$props) $$invalidate(3, inverse = $$props.inverse);
    		if ("pulse" in $$props) $$invalidate(4, pulse = $$props.pulse);
    		if ("flip" in $$props) $$invalidate(5, flip = $$props.flip);
    		if ("label" in $$props) $$invalidate(6, label = $$props.label);
    		if ("self" in $$props) $$invalidate(0, self = $$props.self);
    		if ("style" in $$props) $$invalidate(13, style = $$props.style);
    		if ("$$scope" in $$props) $$invalidate(28, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Path,
    		Polygon,
    		Raw,
    		Svg,
    		className,
    		data,
    		scale,
    		spin,
    		inverse,
    		pulse,
    		flip,
    		label,
    		self,
    		style,
    		x,
    		y,
    		childrenHeight,
    		childrenWidth,
    		outerScale,
    		width,
    		height,
    		combinedStyle,
    		box,
    		init,
    		normaliseData,
    		normalisedScale,
    		calculateBox,
    		calculateRatio,
    		calculateWidth,
    		calculateHeight,
    		calculateStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ("className" in $$props) $$invalidate(1, className = $$props.className);
    		if ("data" in $$props) $$invalidate(11, data = $$props.data);
    		if ("scale" in $$props) $$invalidate(12, scale = $$props.scale);
    		if ("spin" in $$props) $$invalidate(2, spin = $$props.spin);
    		if ("inverse" in $$props) $$invalidate(3, inverse = $$props.inverse);
    		if ("pulse" in $$props) $$invalidate(4, pulse = $$props.pulse);
    		if ("flip" in $$props) $$invalidate(5, flip = $$props.flip);
    		if ("label" in $$props) $$invalidate(6, label = $$props.label);
    		if ("self" in $$props) $$invalidate(0, self = $$props.self);
    		if ("style" in $$props) $$invalidate(13, style = $$props.style);
    		if ("x" in $$props) x = $$props.x;
    		if ("y" in $$props) y = $$props.y;
    		if ("childrenHeight" in $$props) childrenHeight = $$props.childrenHeight;
    		if ("childrenWidth" in $$props) childrenWidth = $$props.childrenWidth;
    		if ("outerScale" in $$props) outerScale = $$props.outerScale;
    		if ("width" in $$props) $$invalidate(7, width = $$props.width);
    		if ("height" in $$props) $$invalidate(8, height = $$props.height);
    		if ("combinedStyle" in $$props) $$invalidate(9, combinedStyle = $$props.combinedStyle);
    		if ("box" in $$props) $$invalidate(10, box = $$props.box);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*data, style, scale*/ 14336) {
    			 {
    				init();
    				$$invalidate(7, width = calculateWidth());
    				$$invalidate(8, height = calculateHeight());
    				$$invalidate(9, combinedStyle = calculateStyle());
    				$$invalidate(10, box = calculateBox());
    			}
    		}
    	};

    	return [
    		self,
    		className,
    		spin,
    		inverse,
    		pulse,
    		flip,
    		label,
    		width,
    		height,
    		combinedStyle,
    		box,
    		data,
    		scale,
    		style,
    		x,
    		y,
    		childrenHeight,
    		childrenWidth,
    		outerScale,
    		init,
    		normalisedScale,
    		calculateBox,
    		calculateRatio,
    		calculateWidth,
    		calculateHeight,
    		calculateStyle,
    		$$slots,
    		raw_data_binding,
    		$$scope
    	];
    }

    class Icon$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$e,
    			create_fragment$e,
    			safe_not_equal,
    			{
    				class: 1,
    				data: 11,
    				scale: 12,
    				spin: 2,
    				inverse: 3,
    				pulse: 4,
    				flip: 5,
    				label: 6,
    				self: 0,
    				style: 13
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[11] === undefined && !("data" in props)) {
    			console_1.warn("<Icon> was created without expected prop 'data'");
    		}
    	}

    	get class() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pulse() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pulse(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flip() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flip(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get self() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set self(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var times = { times: { width: 1408, height: 1792, paths: [{ d: 'M1298 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z' }] } };

    var download = { download: { width: 1664, height: 1792, paths: [{ d: 'M1280 1344q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zM1536 1344q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zM1664 1120v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h465l135 136q58 56 136 56t136-56l136-136h464q40 0 68 28t28 68zM1339 551q17 41-14 70l-448 448q-18 19-45 19t-45-19l-448-448q-31-29-14-70 17-39 59-39h256v-448q0-26 19-45t45-19h256q26 0 45 19t19 45v448h256q42 0 59 39z' }] } };

    var adjust = { adjust: { width: 1536, height: 1792, paths: [{ d: 'M768 1440v-1088q-148 0-273 73t-198 198-73 273 73 273 198 198 273 73zM1536 896q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z' }] } };

    var barChart = { 'bar-chart': { width: 2048, height: 1792, paths: [{ d: 'M640 896v512h-256v-512h256zM1024 384v1024h-256v-1024h256zM2048 1536v128h-2048v-1536h128v1408h1920zM1408 640v768h-256v-768h256zM1792 256v1152h-256v-1152h256z' }] } };

    var linkedinSquare = { 'linkedin-square': { width: 1536, height: 1792, paths: [{ d: 'M237 1414h231v-694h-231v694zM483 506q-1-52-36-86t-93-34-94.5 34-36.5 86q0 51 35.5 85.5t92.5 34.5h1q59 0 95-34.5t36-85.5zM1068 1414h231v-398q0-154-73-233t-193-79q-136 0-209 117h2v-101h-231q3 66 0 694h231v-388q0-38 7-56 15-35 45-59.5t74-24.5q116 0 116 157v371zM1536 416v960q0 119-84.5 203.5t-203.5 84.5h-960q-119 0-203.5-84.5t-84.5-203.5v-960q0-119 84.5-203.5t203.5-84.5h960q119 0 203.5 84.5t84.5 203.5z' }] } };

    var twitter = { twitter: { width: 1664, height: 1792, paths: [{ d: 'M1620 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z' }] } };

    var wrench = { wrench: { width: 1664, height: 1792, paths: [{ d: 'M384 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zM1028 1052l-682 682q-37 37-90 37-52 0-91-37l-106-108q-38-36-38-90 0-53 38-91l681-681q39 98 114.5 173.5t173.5 114.5zM1662 617q0 39-23 106-47 134-164.5 217.5t-258.5 83.5q-185 0-316.5-131.5t-131.5-316.5 131.5-316.5 316.5-131.5q58 0 121.5 16.5t107.5 46.5q16 11 16 28t-16 28l-293 169v224l193 107q5-3 79-48.5t135.5-81 70.5-35.5q15 0 23.5 10t8.5 25z' }] } };

    var bars = { bars: { width: 1536, height: 1792, paths: [{ d: 'M1536 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zM1536 832v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zM1536 320v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z' }] } };

    var filePdfO = { 'file-pdf-o': { width: 1536, height: 1792, paths: [{ d: 'M1468 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zM1024 136v376h376q-10-29-22-41l-313-313q-12-12-41-22zM1408 1664v-1024h-416q-40 0-68-28t-28-68v-416h-768v1536h1280zM894 1071q33 26 84 56 59-7 117-7 147 0 177 49 16 22 2 52 0 1-1 2l-2 2v1q-6 38-71 38-48 0-115-20t-130-53q-221 24-392 83-153 262-242 262-15 0-28-7l-24-12q-1-1-6-5-10-10-6-36 9-40 56-91.5t132-96.5q14-9 23 6 2 2 2 4 52-85 107-197 68-136 104-262-24-82-30.5-159.5t6.5-127.5q11-40 42-40h21 1q23 0 35 15 18 21 9 68-2 6-4 8 1 3 1 8v30q-2 123-14 192 55 164 146 238zM318 1482q52-24 137-158-51 40-87.5 84t-49.5 74zM716 562q-15 42-2 132 1-7 7-44 0-3 7-43 1-4 4-8-1-1-1-2-1-2-1-3-1-22-13-36 0 1-1 2v2zM592 1223q135-54 284-81-2-1-13-9.5t-16-13.5q-76-67-127-176-27 86-83 197-30 56-45 83zM1238 1207q-24-24-140-24 76 28 124 28 14 0 18-1 0-1-2-3z' }] } };

    var handshakeO = { 'handshake-o': { width: 2304, height: 1792, paths: [{ d: 'M192 1152q40 0 56-32t0-64-56-32-56 32 0 64 56 32zM1665 1094q-10-13-38.5-50t-41.5-54-38-49-42.5-53-40.5-47-45-49l-125 140q-83 94-208.5 92t-205.5-98q-57-69-56.5-158t58.5-157l177-206q-22-11-51-16.5t-47.5-6-56.5 0.5-49 1q-92 0-158 66l-158 158h-155v544q5 0 21-0.5t22 0 19.5 2 20.5 4.5 17.5 8.5 18.5 13.5l297 292q115 111 227 111 78 0 125-47 57 20 112.5-8t72.5-85q74 6 127-44 20-18 36-45.5t14-50.5q10 10 43 10 43 0 77-21t49.5-53 12-71.5-30.5-73.5zM1824 1152h96v-512h-93l-157-180q-66-76-169-76h-167q-89 0-146 67l-209 243q-28 33-28 75t27 75q43 51 110 52t111-49l193-218q25-23 53.5-21.5t47 27 8.5 56.5q16 19 56 63t60 68q29 36 82.5 105.5t64.5 84.5q52 66 60 140zM2112 1152q40 0 56-32t0-64-56-32-56 32 0 64 56 32zM2304 576v640q0 26-19 45t-45 19h-434q-27 65-82 106.5t-125 51.5q-33 48-80.5 81.5t-102.5 45.5q-42 53-104.5 81.5t-128.5 24.5q-60 34-126 39.5t-127.5-14-117-53.5-103.5-81l-287-282h-358q-26 0-45-19t-19-45v-672q0-26 19-45t45-19h421q14-14 47-48t47.5-48 44-40 50.5-37.5 51-25.5 62-19.5 68-5.5h117q99 0 181 56 82-56 181-56h167q35 0 67 6t56.5 14.5 51.5 26.5 44.5 31 43 39.5 39 42 41 48 41.5 48.5h355q26 0 45 19t19 45z' }] } };

    // DARK THÈME CONST
    var DARKMODECLASSNAME = "mode-dark";
    var LOCALSTORAGEITEM = "theme";
    var ENV_CONST = {
      DARKMODECLASSNAME: DARKMODECLASSNAME,
      LOCALSTORAGEITEM: LOCALSTORAGEITEM
    };

    /* src/components/navbar/Navbar.svelte generated by Svelte v3.21.0 */

    const { Object: Object_1$1 } = globals;
    const file$e = "src/components/navbar/Navbar.svelte";

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[18] = i;
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[18] = i;
    	return child_ctx;
    }

    // (66:4) <Button       remove="rounded py-2 px-4 {menuIsActive ? 'hover:elevation-5' : ''} relative bg-primary-500 hover:bg-primary-400"       add="rounded-full lg:hidden w-12 h-12 absolute bottom-0 right-0 z-10 bg-custom hover:bg-white-transLight text-black"       on:click="{handleMenuBtnAction}"       data-toggle="collapse"       data-target="#navbarNav"       aria-controls="navbarNav"       aria-expanded="false"       aria-label="Toggle navigation"       id="btnMenu"     >
    function create_default_slot_3(ctx) {
    	let div0;
    	let t;
    	let div1;
    	let current;

    	const icon0 = new Icon$1({
    			props: { data: bars, scale: "1.5" },
    			$$inline: true
    		});

    	const icon1 = new Icon$1({
    			props: { data: times, scale: "1.5" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(icon0.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(icon1.$$.fragment);
    			attr_dev(div0, "class", "bars ease-in-out duration-300 delay-75 transition-all absolute svelte-1qfdnen");
    			add_location(div0, file$e, 76, 6, 2498);
    			attr_dev(div1, "class", "cross ease-in-out duration-300 delay-75 transition-all absolute svelte-1qfdnen");
    			add_location(div1, file$e, 81, 6, 2657);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(icon0, div0, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(icon1, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(icon0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			destroy_component(icon1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(66:4) <Button       remove=\\\"rounded py-2 px-4 {menuIsActive ? 'hover:elevation-5' : ''} relative bg-primary-500 hover:bg-primary-400\\\"       add=\\\"rounded-full lg:hidden w-12 h-12 absolute bottom-0 right-0 z-10 bg-custom hover:bg-white-transLight text-black\\\"       on:click=\\\"{handleMenuBtnAction}\\\"       data-toggle=\\\"collapse\\\"       data-target=\\\"#navbarNav\\\"       aria-controls=\\\"navbarNav\\\"       aria-expanded=\\\"false\\\"       aria-label=\\\"Toggle navigation\\\"       id=\\\"btnMenu\\\"     >",
    		ctx
    	});

    	return block;
    }

    // (100:14) {#if object[0] === list.icon}
    function create_if_block$6(ctx) {
    	let current;

    	const icon = new Icon$1({
    			props: { data: /*icon*/ ctx[19], scale: "1.5" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(100:14) {#if object[0] === list.icon}",
    		ctx
    	});

    	return block;
    }

    // (99:41) {#each Object.entries(icon) as object}
    function create_each_block_2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*object*/ ctx[21][0] === /*list*/ ctx[16].icon && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*object*/ ctx[21][0] === /*list*/ ctx[16].icon) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*navlists*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(99:41) {#each Object.entries(icon) as object}",
    		ctx
    	});

    	return block;
    }

    // (99:14) {#each iconTab as icon, i}
    function create_each_block_1$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_2 = Object.entries(/*icon*/ ctx[19]);
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*iconTab, Object, navlists*/ 17) {
    				each_value_2 = Object.entries(/*icon*/ ctx[19]);
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(99:14) {#each iconTab as icon, i}",
    		ctx
    	});

    	return block;
    }

    // (98:12) <div slot="activator">
    function create_activator_slot_1(ctx) {
    	let div;
    	let current;
    	let each_value_1 = /*iconTab*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "slot", "activator");
    			add_location(div, file$e, 97, 12, 3401);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Object, iconTab, navlists*/ 17) {
    				each_value_1 = /*iconTab*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_activator_slot_1.name,
    		type: "slot",
    		source: "(98:12) <div slot=\\\"activator\\\">",
    		ctx
    	});

    	return block;
    }

    // (97:10) <Tooltip class="capitalize bg-dark-200 bg-opacity-75 hidden lg:block lg:mt-5">
    function create_default_slot_2(ctx) {
    	let t0;
    	let t1_value = /*list*/ ctx[16].label + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = space();
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if ( t1_value !== (t1_value = /*list*/ ctx[16].label + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(97:10) <Tooltip class=\\\"capitalize bg-dark-200 bg-opacity-75 hidden lg:block lg:mt-5\\\">",
    		ctx
    	});

    	return block;
    }

    // (91:6) {#each navlists as list, i}
    function create_each_block$1(ctx) {
    	let li;
    	let a;
    	let a_href_value;
    	let t;
    	let current;
    	let dispose;

    	const tooltip = new Tooltip({
    			props: {
    				class: "capitalize bg-dark-200 bg-opacity-75 hidden lg:block lg:mt-5",
    				$$slots: {
    					default: [create_default_slot_2],
    					activator: [create_activator_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			create_component(tooltip.$$.fragment);
    			t = space();
    			attr_dev(a, "class", "nav-link inline-block font-bold no-underline rounded-full w-12 h-12 flex items-center text-center justify-center text-black svelte-1qfdnen");
    			attr_dev(a, "href", a_href_value = /*list*/ ctx[16].url);
    			add_location(a, file$e, 92, 8, 3062);
    			attr_dev(li, "class", "nav-item mr-3 absolute lg:relative bg-custom rounded-full w-12 h-12 top-0 left-0 svelte-1qfdnen");
    			add_location(li, file$e, 91, 6, 2960);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			mount_component(tooltip, a, null);
    			append_dev(li, t);
    			current = true;
    			if (remount) dispose();

    			dispose = listen_dev(
    				a,
    				"click",
    				function () {
    					if (is_function(/*MenuBtnpressed*/ ctx[3]
    					? /*handleMenuBtnAction*/ ctx[8]
    					: "")) (/*MenuBtnpressed*/ ctx[3]
    					? /*handleMenuBtnAction*/ ctx[8]
    					: "").apply(this, arguments);
    				},
    				false,
    				false,
    				false
    			);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const tooltip_changes = {};

    			if (dirty & /*$$scope, navlists*/ 16777217) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);

    			if (!current || dirty & /*navlists*/ 1 && a_href_value !== (a_href_value = /*list*/ ctx[16].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(tooltip);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(91:6) {#each navlists as list, i}",
    		ctx
    	});

    	return block;
    }

    // (113:10) <Button class="px-4 text-sm hover:bg-transparent p-4 pt-1 pb-1 pl-2 pr-2 text-xs h-12 w-12 rounded-full relative text-black" bind:value={darkMode} flat>
    function create_default_slot_1$2(ctx) {
    	let current;

    	const icon = new Icon$1({
    			props: {
    				data: adjust,
    				scale: "1.5",
    				label: /*darkMode*/ ctx[1]
    				? /*TEXTLIGHT*/ ctx[7]
    				: /*TEXTDARK*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};

    			if (dirty & /*darkMode*/ 2) icon_changes.label = /*darkMode*/ ctx[1]
    			? /*TEXTLIGHT*/ ctx[7]
    			: /*TEXTDARK*/ ctx[6];

    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(113:10) <Button class=\\\"px-4 text-sm hover:bg-transparent p-4 pt-1 pb-1 pl-2 pr-2 text-xs h-12 w-12 rounded-full relative text-black\\\" bind:value={darkMode} flat>",
    		ctx
    	});

    	return block;
    }

    // (112:8) <div slot="activator" on:click="{toggleThemeChange}">
    function create_activator_slot(ctx) {
    	let div;
    	let updating_value;
    	let current;
    	let dispose;

    	function button_value_binding(value) {
    		/*button_value_binding*/ ctx[15].call(null, value);
    	}

    	let button_props = {
    		class: "px-4 text-sm hover:bg-transparent p-4 pt-1 pb-1 pl-2 pr-2 text-xs h-12 w-12 rounded-full relative text-black",
    		flat: true,
    		$$slots: { default: [create_default_slot_1$2] },
    		$$scope: { ctx }
    	};

    	if (/*darkMode*/ ctx[1] !== void 0) {
    		button_props.value = /*darkMode*/ ctx[1];
    	}

    	const button = new Button({ props: button_props, $$inline: true });
    	binding_callbacks.push(() => bind(button, "value", button_value_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div, "slot", "activator");
    			add_location(div, file$e, 111, 8, 3945);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(div, "click", /*toggleThemeChange*/ ctx[5], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope, darkMode*/ 16777218) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*darkMode*/ 2) {
    				updating_value = true;
    				button_changes.value = /*darkMode*/ ctx[1];
    				add_flush_callback(() => updating_value = false);
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_activator_slot.name,
    		type: "slot",
    		source: "(112:8) <div slot=\\\"activator\\\" on:click=\\\"{toggleThemeChange}\\\">",
    		ctx
    	});

    	return block;
    }

    // (111:6) <Tooltip class="capitalize bg-dark-200 bg-opacity-75">
    function create_default_slot$5(ctx) {
    	let t0;

    	let t1_value = (/*darkMode*/ ctx[1]
    	? /*TEXTLIGHT*/ ctx[7]
    	: /*TEXTDARK*/ ctx[6]) + "";

    	let t1;

    	const block = {
    		c: function create() {
    			t0 = space();
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if ( t1_value !== (t1_value = (/*darkMode*/ ctx[1]
    			? /*TEXTLIGHT*/ ctx[7]
    			: /*TEXTDARK*/ ctx[6]) + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(111:6) <Tooltip class=\\\"capitalize bg-dark-200 bg-opacity-75\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let nav;
    	let div1;
    	let t0;
    	let ul;
    	let t1;
    	let div0;
    	let t2;
    	let svg;
    	let defs;
    	let filter0;
    	let feGaussianBlur0;
    	let feColorMatrix0;
    	let feGaussianBlur1;
    	let feColorMatrix1;
    	let feOffset;
    	let feComposite0;
    	let feComposite1;
    	let filter1;
    	let feGaussianBlur2;
    	let feColorMatrix2;
    	let feComposite2;
    	let nav_class_value;
    	let current;

    	const button = new Button({
    			props: {
    				remove: "rounded py-2 px-4 " + (/*menuIsActive*/ ctx[2] ? "hover:elevation-5" : "") + " relative bg-primary-500 hover:bg-primary-400",
    				add: "rounded-full lg:hidden w-12 h-12 absolute bottom-0 right-0 z-10 bg-custom hover:bg-white-transLight text-black",
    				"data-toggle": "collapse",
    				"data-target": "#navbarNav",
    				"aria-controls": "navbarNav",
    				"aria-expanded": "false",
    				"aria-label": "Toggle navigation",
    				id: "btnMenu",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*handleMenuBtnAction*/ ctx[8]);
    	let each_value = /*navlists*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const tooltip = new Tooltip({
    			props: {
    				class: "capitalize bg-dark-200 bg-opacity-75",
    				$$slots: {
    					default: [create_default_slot$5],
    					activator: [create_activator_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div1 = element("div");
    			create_component(button.$$.fragment);
    			t0 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div0 = element("div");
    			create_component(tooltip.$$.fragment);
    			t2 = space();
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			filter0 = svg_element("filter");
    			feGaussianBlur0 = svg_element("feGaussianBlur");
    			feColorMatrix0 = svg_element("feColorMatrix");
    			feGaussianBlur1 = svg_element("feGaussianBlur");
    			feColorMatrix1 = svg_element("feColorMatrix");
    			feOffset = svg_element("feOffset");
    			feComposite0 = svg_element("feComposite");
    			feComposite1 = svg_element("feComposite");
    			filter1 = svg_element("filter");
    			feGaussianBlur2 = svg_element("feGaussianBlur");
    			feColorMatrix2 = svg_element("feColorMatrix");
    			feComposite2 = svg_element("feComposite");
    			attr_dev(ul, "class", "nav list-reset lg:flex justify-end flex-1 items-center capitalize");
    			add_location(ul, file$e, 87, 4, 2830);
    			attr_dev(div0, "class", "switch-theme absolute lg:relative items-center text-center justify-center bg-custom rounded-full w-12 h-12 top-0 left-0 svelte-1qfdnen");
    			add_location(div0, file$e, 109, 4, 3742);
    			attr_dev(feGaussianBlur0, "in", "SourceGraphic");
    			attr_dev(feGaussianBlur0, "result", "blur");
    			attr_dev(feGaussianBlur0, "stdDeviation", "10");
    			add_location(feGaussianBlur0, file$e, 124, 12, 4512);
    			attr_dev(feColorMatrix0, "in", "blur");
    			attr_dev(feColorMatrix0, "mode", "matrix");
    			attr_dev(feColorMatrix0, "values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7");
    			attr_dev(feColorMatrix0, "result", "goo");
    			add_location(feColorMatrix0, file$e, 125, 12, 4609);
    			attr_dev(feGaussianBlur1, "in", "goo");
    			attr_dev(feGaussianBlur1, "stdDeviation", "3");
    			attr_dev(feGaussianBlur1, "result", "shadow");
    			add_location(feGaussianBlur1, file$e, 126, 12, 4744);
    			attr_dev(feColorMatrix1, "in", "shadow");
    			attr_dev(feColorMatrix1, "mode", "matrix");
    			attr_dev(feColorMatrix1, "values", "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2");
    			attr_dev(feColorMatrix1, "result", "shadow");
    			add_location(feColorMatrix1, file$e, 127, 12, 4832);
    			attr_dev(feOffset, "in", "shadow");
    			attr_dev(feOffset, "dx", "1");
    			attr_dev(feOffset, "dy", "1");
    			attr_dev(feOffset, "result", "shadow");
    			add_location(feOffset, file$e, 128, 12, 4973);
    			attr_dev(feComposite0, "in2", "shadow");
    			attr_dev(feComposite0, "in", "goo");
    			attr_dev(feComposite0, "result", "goo");
    			add_location(feComposite0, file$e, 129, 12, 5049);
    			attr_dev(feComposite1, "in2", "goo");
    			attr_dev(feComposite1, "in", "SourceGraphic");
    			attr_dev(feComposite1, "result", "mix");
    			add_location(feComposite1, file$e, 130, 12, 5124);
    			attr_dev(filter0, "id", "shadowed-goo");
    			add_location(filter0, file$e, 122, 8, 4460);
    			attr_dev(feGaussianBlur2, "in", "SourceGraphic");
    			attr_dev(feGaussianBlur2, "result", "blur");
    			attr_dev(feGaussianBlur2, "stdDeviation", "10");
    			add_location(feGaussianBlur2, file$e, 133, 12, 5250);
    			attr_dev(feColorMatrix2, "in", "blur");
    			attr_dev(feColorMatrix2, "mode", "matrix");
    			attr_dev(feColorMatrix2, "values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7");
    			attr_dev(feColorMatrix2, "result", "goo");
    			add_location(feColorMatrix2, file$e, 134, 12, 5347);
    			attr_dev(feComposite2, "in2", "goo");
    			attr_dev(feComposite2, "in", "SourceGraphic");
    			attr_dev(feComposite2, "result", "mix");
    			add_location(feComposite2, file$e, 135, 12, 5482);
    			attr_dev(filter1, "id", "goo");
    			add_location(filter1, file$e, 132, 8, 5220);
    			add_location(defs, file$e, 121, 6, 4445);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "class", "lg:hidden");
    			add_location(svg, file$e, 120, 4, 4366);
    			attr_dev(div1, "class", "navbar-content w-12 h-12 lg:w-auto lg:w-full flex-grow lg:flex lg:items-center lg:w-auto lg:block lg:mt-2 lg:mt-0 lg:bg-transparent p-4 lg:p-0 z-20");
    			attr_dev(div1, "id", "navbarNav");
    			add_location(div1, file$e, 61, 2, 1828);
    			attr_dev(nav, "class", nav_class_value = "navbar " + (/*menuIsActive*/ ctx[2] ? "navbar-active" : "w-12 h-12 ") + " lg:w-auto lg:h-auto lg:relative fixed right-0 bottom-0 mr-2 mb-2" + " svelte-1qfdnen");
    			add_location(nav, file$e, 58, 0, 1690);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div1);
    			mount_component(button, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(tooltip, div0, null);
    			append_dev(div1, t2);
    			append_dev(div1, svg);
    			append_dev(svg, defs);
    			append_dev(defs, filter0);
    			append_dev(filter0, feGaussianBlur0);
    			append_dev(filter0, feColorMatrix0);
    			append_dev(filter0, feGaussianBlur1);
    			append_dev(filter0, feColorMatrix1);
    			append_dev(filter0, feOffset);
    			append_dev(filter0, feComposite0);
    			append_dev(filter0, feComposite1);
    			append_dev(defs, filter1);
    			append_dev(filter1, feGaussianBlur2);
    			append_dev(filter1, feColorMatrix2);
    			append_dev(filter1, feComposite2);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};
    			if (dirty & /*menuIsActive*/ 4) button_changes.remove = "rounded py-2 px-4 " + (/*menuIsActive*/ ctx[2] ? "hover:elevation-5" : "") + " relative bg-primary-500 hover:bg-primary-400";

    			if (dirty & /*$$scope*/ 16777216) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty & /*navlists, MenuBtnpressed, handleMenuBtnAction, iconTab, Object*/ 281) {
    				each_value = /*navlists*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const tooltip_changes = {};

    			if (dirty & /*$$scope, darkMode*/ 16777218) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);

    			if (!current || dirty & /*menuIsActive*/ 4 && nav_class_value !== (nav_class_value = "navbar " + (/*menuIsActive*/ ctx[2] ? "navbar-active" : "w-12 h-12 ") + " lg:w-auto lg:h-auto lg:relative fixed right-0 bottom-0 mr-2 mb-2" + " svelte-1qfdnen")) {
    				attr_dev(nav, "class", nav_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(tooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(tooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(button);
    			destroy_each(each_blocks, detaching);
    			destroy_component(tooltip);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	const { DARKMODECLASSNAME, LOCALSTORAGEITEM } = ENV_CONST;

    	// IconTab
    	const iconTab = [barChart, handshakeO, filePdfO, wrench];

    	const dispatch = createEventDispatcher();
    	const currentTheme = localStorage.getItem(LOCALSTORAGEITEM);
    	let darkMode = currentTheme === DARKMODECLASSNAME ? true : false;

    	currentTheme === DARKMODECLASSNAME
    	? window.document.body.classList.add(DARKMODECLASSNAME)
    	: window.document.body.classList.remove(DARKMODECLASSNAME);

    	let toggleThemeChange = () => {
    		if (darkMode === true) {
    			// Update localstorage
    			localStorage.setItem(LOCALSTORAGEITEM, DARKMODECLASSNAME);

    			window.document.body.classList.add(DARKMODECLASSNAME);
    		} else {
    			// Update localstorage
    			localStorage.removeItem(LOCALSTORAGEITEM);

    			window.document.body.classList.remove(DARKMODECLASSNAME);
    		}
    	};

    	let { navlists = [] } = $$props;
    	let { switchBtn = {} } = $$props;
    	const { TEXTDARK, TEXTLIGHT } = switchBtn;
    	let menuIsActive = false;
    	let MenuBtnpressed = false;

    	let handleMenuDispatch = () => {
    		dispatch("message", { toggleMenuBtnClick: menuIsActive });
    	};

    	let handleMenuBtnAction = () => {
    		$$invalidate(2, menuIsActive = !menuIsActive);
    		$$invalidate(3, MenuBtnpressed = !MenuBtnpressed);
    		handleMenuDispatch();
    	};

    	const writable_props = ["navlists", "switchBtn"];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Navbar", $$slots, []);

    	function button_value_binding(value) {
    		darkMode = value;
    		$$invalidate(1, darkMode);
    	}

    	$$self.$set = $$props => {
    		if ("navlists" in $$props) $$invalidate(0, navlists = $$props.navlists);
    		if ("switchBtn" in $$props) $$invalidate(9, switchBtn = $$props.switchBtn);
    	};

    	$$self.$capture_state = () => ({
    		Switch,
    		Tooltip,
    		Button,
    		Icon: Icon$1,
    		bars,
    		times,
    		adjust,
    		barChart,
    		handshakeO,
    		filePdfO,
    		wrench,
    		fly,
    		ENV_CONST,
    		createEventDispatcher,
    		DARKMODECLASSNAME,
    		LOCALSTORAGEITEM,
    		iconTab,
    		dispatch,
    		currentTheme,
    		darkMode,
    		toggleThemeChange,
    		navlists,
    		switchBtn,
    		TEXTDARK,
    		TEXTLIGHT,
    		menuIsActive,
    		MenuBtnpressed,
    		handleMenuDispatch,
    		handleMenuBtnAction
    	});

    	$$self.$inject_state = $$props => {
    		if ("darkMode" in $$props) $$invalidate(1, darkMode = $$props.darkMode);
    		if ("toggleThemeChange" in $$props) $$invalidate(5, toggleThemeChange = $$props.toggleThemeChange);
    		if ("navlists" in $$props) $$invalidate(0, navlists = $$props.navlists);
    		if ("switchBtn" in $$props) $$invalidate(9, switchBtn = $$props.switchBtn);
    		if ("menuIsActive" in $$props) $$invalidate(2, menuIsActive = $$props.menuIsActive);
    		if ("MenuBtnpressed" in $$props) $$invalidate(3, MenuBtnpressed = $$props.MenuBtnpressed);
    		if ("handleMenuDispatch" in $$props) handleMenuDispatch = $$props.handleMenuDispatch;
    		if ("handleMenuBtnAction" in $$props) $$invalidate(8, handleMenuBtnAction = $$props.handleMenuBtnAction);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		navlists,
    		darkMode,
    		menuIsActive,
    		MenuBtnpressed,
    		iconTab,
    		toggleThemeChange,
    		TEXTDARK,
    		TEXTLIGHT,
    		handleMenuBtnAction,
    		switchBtn,
    		DARKMODECLASSNAME,
    		LOCALSTORAGEITEM,
    		dispatch,
    		currentTheme,
    		handleMenuDispatch,
    		button_value_binding
    	];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { navlists: 0, switchBtn: 9 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get navlists() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navlists(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get switchBtn() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set switchBtn(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/containers/Header_container.svelte generated by Svelte v3.21.0 */

    const { window: window_1 } = globals;
    const file$f = "src/containers/Header_container.svelte";

    function create_fragment$g(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let div1;
    	let div0;
    	let a;
    	let t;
    	let current;
    	let dispose;
    	add_render_callback(/*onwindowscroll*/ ctx[4]);

    	const avatar_1 = new Avatar({
    			props: {
    				avatar: /*avatar*/ ctx[0],
    				avatarClass: "hidden lg:block w-10 h-10",
    				widthHeight: "40"
    			},
    			$$inline: true
    		});

    	const navbar = new Navbar({
    			props: {
    				navlists: /*navlists*/ ctx[1],
    				switchBtn: /*switchBtn*/ ctx[2]
    			},
    			$$inline: true
    		});

    	navbar.$on("message", /*message_handler*/ ctx[5]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			a = element("a");
    			create_component(avatar_1.$$.fragment);
    			t = space();
    			create_component(navbar.$$.fragment);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "px-2 md:px-8 flex items-center");
    			add_location(a, file$f, 25, 2, 593);
    			attr_dev(div0, "class", "pl-4 lg:flex items-center");
    			add_location(div0, file$f, 24, 1, 551);
    			attr_dev(div1, "class", "w-full container mx-auto flex flex-wrap items-center justify-between mt-0");
    			add_location(div1, file$f, 23, 0, 462);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, a);
    			mount_component(avatar_1, a, null);
    			append_dev(div1, t);
    			mount_component(navbar, div1, null);
    			current = true;
    			if (remount) dispose();

    			dispose = listen_dev(window_1, "scroll", () => {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrolling_timeout = setTimeout(clear_scrolling, 100);
    				/*onwindowscroll*/ ctx[4]();
    			});
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*y*/ 8 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo(window_1.pageXOffset, /*y*/ ctx[3]);
    				scrolling_timeout = setTimeout(clear_scrolling, 100);
    			}

    			const avatar_1_changes = {};
    			if (dirty & /*avatar*/ 1) avatar_1_changes.avatar = /*avatar*/ ctx[0];
    			avatar_1.$set(avatar_1_changes);
    			const navbar_changes = {};
    			if (dirty & /*navlists*/ 2) navbar_changes.navlists = /*navlists*/ ctx[1];
    			if (dirty & /*switchBtn*/ 4) navbar_changes.switchBtn = /*switchBtn*/ ctx[2];
    			navbar.$set(navbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(avatar_1.$$.fragment, local);
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(avatar_1.$$.fragment, local);
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(avatar_1);
    			destroy_component(navbar);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let y;
    	let { avatar } = $$props;
    	let { navlists } = $$props;
    	let { switchBtn } = $$props;
    	const writable_props = ["avatar", "navlists", "switchBtn"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header_container> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Header_container", $$slots, []);

    	function onwindowscroll() {
    		$$invalidate(3, y = window_1.pageYOffset);
    	}

    	function message_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("avatar" in $$props) $$invalidate(0, avatar = $$props.avatar);
    		if ("navlists" in $$props) $$invalidate(1, navlists = $$props.navlists);
    		if ("switchBtn" in $$props) $$invalidate(2, switchBtn = $$props.switchBtn);
    	};

    	$$self.$capture_state = () => ({
    		Avatar,
    		Navbar,
    		y,
    		avatar,
    		navlists,
    		switchBtn
    	});

    	$$self.$inject_state = $$props => {
    		if ("y" in $$props) $$invalidate(3, y = $$props.y);
    		if ("avatar" in $$props) $$invalidate(0, avatar = $$props.avatar);
    		if ("navlists" in $$props) $$invalidate(1, navlists = $$props.navlists);
    		if ("switchBtn" in $$props) $$invalidate(2, switchBtn = $$props.switchBtn);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*y*/ 8) {
    			 (() => {
    				let header = document.getElementById("header");

    				if (y > 10) {
    					header.classList.add("shadow");
    				}

    				if (y < 10) {
    					header.classList.remove("shadow");
    				}
    			})();
    		}
    	};

    	return [avatar, navlists, switchBtn, y, onwindowscroll, message_handler];
    }

    class Header_container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { avatar: 0, navlists: 1, switchBtn: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header_container",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*avatar*/ ctx[0] === undefined && !("avatar" in props)) {
    			console.warn("<Header_container> was created without expected prop 'avatar'");
    		}

    		if (/*navlists*/ ctx[1] === undefined && !("navlists" in props)) {
    			console.warn("<Header_container> was created without expected prop 'navlists'");
    		}

    		if (/*switchBtn*/ ctx[2] === undefined && !("switchBtn" in props)) {
    			console.warn("<Header_container> was created without expected prop 'switchBtn'");
    		}
    	}

    	get avatar() {
    		throw new Error("<Header_container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set avatar(value) {
    		throw new Error("<Header_container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get navlists() {
    		throw new Error("<Header_container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navlists(value) {
    		throw new Error("<Header_container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get switchBtn() {
    		throw new Error("<Header_container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set switchBtn(value) {
    		throw new Error("<Header_container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/heading/Profil.svelte generated by Svelte v3.21.0 */

    const file$g = "src/components/heading/Profil.svelte";

    function create_fragment$h(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(/*profession*/ ctx[0]);
    			t1 = space();
    			p = element("p");
    			t2 = text(/*firstname*/ ctx[1]);
    			t3 = space();
    			t4 = text(/*lastname*/ ctx[2]);
    			attr_dev(h1, "class", "my-4 text-2xl font-bold leading-tight capitalize");
    			add_location(h1, file$g, 7, 2, 126);
    			attr_dev(p, "class", "leading-normal text-lg mb-4 capitalize");
    			add_location(p, file$g, 8, 2, 207);
    			attr_dev(div, "class", "profession w-full");
    			add_location(div, file$g, 6, 0, 92);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
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
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { profession: 0, firstname: 1, lastname: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profil",
    			options,
    			id: create_fragment$h.name
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

    /* src/components/buttons/social/Social.svelte generated by Svelte v3.21.0 */
    const file$h = "src/components/buttons/social/Social.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i].name;
    	child_ctx[4] = list[i].url;
    	child_ctx[5] = list[i].rel;
    	child_ctx[6] = list[i].target;
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (21:8) {#if name === "twitter"}
    function create_if_block_1$4(ctx) {
    	let current;

    	const icon = new Icon$1({
    			props: {
    				data: twitter,
    				title: /*name*/ ctx[3],
    				label: /*name*/ ctx[3],
    				scale: "1.2"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(21:8) {#if name === \\\"twitter\\\"}",
    		ctx
    	});

    	return block;
    }

    // (23:14) {#if name === "linkedin"}
    function create_if_block$7(ctx) {
    	let current;

    	const icon = new Icon$1({
    			props: {
    				data: linkedinSquare,
    				title: /*name*/ ctx[3],
    				label: /*name*/ ctx[3],
    				scale: "1.2"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(23:14) {#if name === \\\"linkedin\\\"}",
    		ctx
    	});

    	return block;
    }

    // (12:4) {#each LISTS as { name, url, rel, target }
    function create_each_block$2(ctx) {
    	let li;
    	let a;
    	let t0;
    	let a_href_value;
    	let a_rel_value;
    	let a_target_value;
    	let a_data_name_value;
    	let t1;
    	let current;
    	let if_block0 = /*name*/ ctx[3] === "twitter" && create_if_block_1$4(ctx);
    	let if_block1 = /*name*/ ctx[3] === "linkedin" && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*url*/ ctx[4]);
    			attr_dev(a, "rel", a_rel_value = /*rel*/ ctx[5]);
    			attr_dev(a, "target", a_target_value = /*target*/ ctx[6]);
    			attr_dev(a, "data-name", a_data_name_value = /*name*/ ctx[3]);
    			attr_dev(a, "class", "opacity-50 hover:opacity-100");
    			add_location(a, file$h, 13, 6, 382);
    			attr_dev(li, "class", "item inline-block mr-3");
    			add_location(li, file$h, 12, 4, 340);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			if (if_block0) if_block0.m(a, null);
    			append_dev(a, t0);
    			if (if_block1) if_block1.m(a, null);
    			append_dev(li, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*name*/ ctx[3] === "twitter") if_block0.p(ctx, dirty);
    			if (/*name*/ ctx[3] === "linkedin") if_block1.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(12:4) {#each LISTS as { name, url, rel, target }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div;
    	let ul;
    	let div_class_value;
    	let current;
    	let each_value = /*LISTS*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "social-list list-reset");
    			add_location(ul, file$h, 10, 2, 249);
    			attr_dev(div, "class", div_class_value = "social " + /*socialClass*/ ctx[0]);
    			add_location(div, file$h, 9, 0, 212);
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

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*LISTS, linkedinSquare, twitter*/ 2) {
    				each_value = /*LISTS*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*socialClass*/ 1 && div_class_value !== (div_class_value = "social " + /*socialClass*/ ctx[0])) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { socialData = {} } = $$props;
    	let { socialClass } = $$props;
    	const { LISTS } = socialData;
    	const writable_props = ["socialData", "socialClass"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Social> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Social", $$slots, []);

    	$$self.$set = $$props => {
    		if ("socialData" in $$props) $$invalidate(2, socialData = $$props.socialData);
    		if ("socialClass" in $$props) $$invalidate(0, socialClass = $$props.socialClass);
    	};

    	$$self.$capture_state = () => ({
    		Icon: Icon$1,
    		linkedinSquare,
    		twitter,
    		socialData,
    		socialClass,
    		LISTS
    	});

    	$$self.$inject_state = $$props => {
    		if ("socialData" in $$props) $$invalidate(2, socialData = $$props.socialData);
    		if ("socialClass" in $$props) $$invalidate(0, socialClass = $$props.socialClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [socialClass, LISTS, socialData];
    }

    class Social extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { socialData: 2, socialClass: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Social",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*socialClass*/ ctx[0] === undefined && !("socialClass" in props)) {
    			console.warn("<Social> was created without expected prop 'socialClass'");
    		}
    	}

    	get socialData() {
    		throw new Error("<Social>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set socialData(value) {
    		throw new Error("<Social>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get socialClass() {
    		throw new Error("<Social>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set socialClass(value) {
    		throw new Error("<Social>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/skills/Skills.svelte generated by Svelte v3.21.0 */
    const file$i = "src/components/skills/Skills.svelte";

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i].name;
    	child_ctx[8] = list[i].level;
    	child_ctx[6] = i;
    	return child_ctx;
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i].cat_title;
    	child_ctx[4] = list[i].cat_items;
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (19:6) {#each cat_items as { name, level }
    function create_each_block_1$2(ctx) {
    	let li;
    	let div0;
    	let t0_value = /*name*/ ctx[7] + "";
    	let t0;
    	let t1;
    	let small;
    	let t2;
    	let t3_value = /*level*/ ctx[8] + "";
    	let t3;
    	let t4;
    	let t5;
    	let div1;
    	let div1_class_value;
    	let t6;
    	let current;

    	const progresslinear = new ProgressLinear({
    			props: { progress: /*level*/ ctx[8] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			small = element("small");
    			t2 = text("(");
    			t3 = text(t3_value);
    			t4 = text("%)");
    			t5 = space();
    			div1 = element("div");
    			create_component(progresslinear.$$.fragment);
    			t6 = space();
    			add_location(small, file$i, 22, 12, 812);
    			attr_dev(div0, "class", "cat-item-title capitalize w-4/12");
    			add_location(div0, file$i, 20, 8, 735);
    			attr_dev(div1, "class", div1_class_value = "bg-gray-transDark rounded-full cat-item-progressbar-" + /*name*/ ctx[7] + " w-8/12 h-4");
    			add_location(div1, file$i, 24, 8, 861);
    			attr_dev(li, "class", "cat-item mb-6 flex items-center");
    			add_location(li, file$i, 19, 6, 682);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, small);
    			append_dev(small, t2);
    			append_dev(small, t3);
    			append_dev(small, t4);
    			append_dev(li, t5);
    			append_dev(li, div1);
    			mount_component(progresslinear, div1, null);
    			append_dev(li, t6);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progresslinear.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progresslinear.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(progresslinear);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(19:6) {#each cat_items as { name, level }",
    		ctx
    	});

    	return block;
    }

    // (13:2) {#each LISTS as { cat_title, cat_items }
    function create_each_block$3(ctx) {
    	let div1;
    	let div0;
    	let t0_value = /*cat_title*/ ctx[3] + "";
    	let t0;
    	let t1;
    	let ul;
    	let t2;
    	let current;
    	let each_value_1 = /*cat_items*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			attr_dev(div0, "class", "cat-title w-full font-bold text-xl text-gray-800 px-6 capitalize mb-8 text-center dark:text-gray-100");
    			add_location(div0, file$i, 14, 4, 455);
    			attr_dev(ul, "class", "cat_item-list");
    			add_location(ul, file$i, 17, 4, 603);
    			attr_dev(div1, "class", "cat-box w-full md:w-1/3 p-6 flex flex-col flex-grow flex-shrink");
    			add_location(div1, file$i, 13, 2, 373);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div1, t2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*LISTS*/ 2) {
    				each_value_1 = /*cat_items*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(13:2) {#each LISTS as { cat_title, cat_items }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let current;
    	let each_value = /*LISTS*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = `${/*TITLE*/ ctx[0]}`;
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "skills-title w-full my-2 text-2xl font-bold leading-tight text-center text-gray-800 capitalize dark:text-gray-100");
    			add_location(h1, file$i, 7, 2, 170);
    			attr_dev(div, "class", "skills flex flex-wrap");
    			add_location(div, file$i, 6, 0, 132);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*LISTS*/ 2) {
    				each_value = /*LISTS*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
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

    	$$self.$capture_state = () => ({ ProgressLinear, skillsData, TITLE, LISTS });

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
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { skillsData: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get skillsData() {
    		throw new Error("<Skills>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skillsData(value) {
    		throw new Error("<Skills>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/tools/Tools.svelte generated by Svelte v3.21.0 */
    const file$j = "src/components/tools/Tools.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (16:6) <Chip selectable="{false}">
    function create_default_slot$6(ctx) {
    	let t_value = /*list*/ ctx[3] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(16:6) <Chip selectable=\\\"{false}\\\">",
    		ctx
    	});

    	return block;
    }

    // (14:4) {#each LISTS as list, i}
    function create_each_block$4(ctx) {
    	let li;
    	let t;
    	let current;

    	const chip = new Chip({
    			props: {
    				selectable: false,
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(chip.$$.fragment);
    			t = space();
    			attr_dev(li, "class", "tools-item mt-2 inline-block mr-2");
    			add_location(li, file$j, 14, 4, 380);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(chip, li, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const chip_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				chip_changes.$$scope = { dirty, ctx };
    			}

    			chip.$set(chip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(chip);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(14:4) {#each LISTS as list, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let ul;
    	let current;
    	let each_value = /*LISTS*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = `${/*TITLE*/ ctx[0]}`;
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "tools-title w-full my-2 text-2xl font-bold leading-tight text-center text-gray-800 dark:text-gray-100 capitalize");
    			add_location(h1, file$j, 7, 2, 142);
    			attr_dev(ul, "class", "tools-items-list list-reset mb-6 p-6");
    			add_location(ul, file$j, 12, 2, 297);
    			attr_dev(div, "class", "tools");
    			add_location(div, file$j, 6, 0, 120);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*LISTS*/ 2) {
    				each_value = /*LISTS*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
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

    	$$self.$capture_state = () => ({ Chip, toolsData, TITLE, LISTS });

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
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { toolsData: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tools",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get toolsData() {
    		throw new Error("<Tools>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toolsData(value) {
    		throw new Error("<Tools>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/trust/Trust.svelte generated by Svelte v3.21.0 */

    const file$k = "src/components/trust/Trust.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i].name;
    	child_ctx[4] = list[i].logo;
    	child_ctx[5] = list[i].svg;
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (15:4) {#each COMPANIES as { name, logo, svg }
    function create_each_block$5(ctx) {
    	let li;
    	let div;
    	let raw_value = /*svg*/ ctx[5] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t = space();
    			attr_dev(div, "class", "logo");
    			add_location(div, file$k, 16, 6, 505);
    			attr_dev(li, "class", "item my-6");
    			add_location(li, file$k, 15, 4, 476);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			div.innerHTML = raw_value;
    			append_dev(li, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(15:4) {#each COMPANIES as { name, logo, svg }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let ul;
    	let each_value = /*COMPANIES*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
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

    			attr_dev(div0, "class", "trust_title w-full my-2 text-2xl font-bold leading-tight text-center text-gray-800 dark:text-gray-100 capitalize");
    			add_location(div0, file$k, 6, 2, 157);
    			attr_dev(ul, "class", "companies-list p-6 flex justify-around flex-col sm:flex-row flex-wrap w-full items-center");
    			add_location(ul, file$k, 11, 2, 314);
    			attr_dev(div1, "class", "trust container mx-auto flex flex-wrap pt-4 pb-12");
    			add_location(div1, file$k, 5, 0, 91);
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
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
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
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { trustData: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Trust",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get trustData() {
    		throw new Error("<Trust>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trustData(value) {
    		throw new Error("<Trust>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/seperatebar/SeperateBar.svelte generated by Svelte v3.21.0 */

    const file$l = "src/components/seperatebar/SeperateBar.svelte";

    function create_fragment$m(ctx) {
    	let svg;
    	let g4;
    	let g3;
    	let g0;
    	let path0;
    	let g2;
    	let g1;
    	let path1;
    	let path2;
    	let path3;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g4 = svg_element("g");
    			g3 = svg_element("g");
    			g0 = svg_element("g");
    			path0 = svg_element("path");
    			g2 = svg_element("g");
    			g1 = svg_element("g");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			attr_dev(path0, "d", "M1440,84 C1383.555,64.3 1342.555,51.3 1317,45 C1259.5,30.824 1206.707,25.526 1169,22 C1129.711,18.326 1044.426,18.475 980,22 C954.25,23.409 922.25,26.742 884,32 C845.122,37.787 818.455,42.121 804,45 C776.833,50.41 728.136,61.77 713,65 C660.023,76.309 621.544,87.729 584,94 C517.525,105.104 484.525,106.438 429,108 C379.49,106.484 342.823,104.484 319,102 C278.571,97.783 231.737,88.736 205,84 C154.629,75.076 86.296,57.743 0,32 L0,0 L1440,0 L1440,84 Z");
    			add_location(path0, file$l, 14, 8, 385);
    			attr_dev(g0, "class", "wave-1");
    			add_location(g0, file$l, 13, 6, 358);
    			attr_dev(path1, "d", "M0,0 C90.7283404,0.927527913 147.912752,27.187927 291.910178,59.9119003 C387.908462,81.7278826 543.605069,89.334785 759,82.7326078 C469.336065,156.254352 216.336065,153.6679 0,74.9732496");
    			attr_dev(path1, "opacity", "0.100000001");
    			add_location(path1, file$l, 22, 10, 1094);
    			attr_dev(path2, "d", "M100,104.708498 C277.413333,72.2345949 426.147877,52.5246657 546.203633,45.5787101 C666.259389,38.6327546 810.524845,41.7979068 979,55.0741668 C931.069965,56.122511 810.303266,74.8455141 616.699903,111.243176 C423.096539,147.640838 250.863238,145.462612 100,104.708498 Z");
    			attr_dev(path2, "opacity", "0.100000001");
    			add_location(path2, file$l, 26, 10, 1366);
    			attr_dev(path3, "d", "M1046,51.6521276 C1130.83045,29.328812 1279.08318,17.607883 1439,40.1656806 L1439,120 C1271.17211,77.9435312 1140.17211,55.1609071 1046,51.6521276 Z");
    			attr_dev(path3, "opacity", "0.200000003");
    			add_location(path3, file$l, 30, 10, 1722);
    			attr_dev(g1, "transform", "translate(719.500000, 68.500000) rotate(-180.000000) translate(-719.500000, -68.500000) ");
    			add_location(g1, file$l, 19, 8, 960);
    			attr_dev(g2, "class", "wave-2");
    			attr_dev(g2, "transform", "translate(1.000000, 15.000000)");
    			add_location(g2, file$l, 18, 6, 890);
    			attr_dev(g3, "transform", "translate(-1.000000, -14.000000)");
    			attr_dev(g3, "fill-rule", "nonzero");
    			add_location(g3, file$l, 12, 4, 283);
    			attr_dev(g4, "stroke", "none");
    			attr_dev(g4, "stroke-width", "1");
    			attr_dev(g4, "fill", "none");
    			attr_dev(g4, "fill-rule", "evenodd");
    			add_location(g4, file$l, 11, 2, 212);
    			attr_dev(svg, "class", /*seperateBarClass*/ ctx[0]);
    			attr_dev(svg, "viewBox", "0 0 1439 147");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			add_location(svg, file$l, 4, 0, 51);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g4);
    			append_dev(g4, g3);
    			append_dev(g3, g0);
    			append_dev(g0, path0);
    			append_dev(g3, g2);
    			append_dev(g2, g1);
    			append_dev(g1, path1);
    			append_dev(g1, path2);
    			append_dev(g1, path3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*seperateBarClass*/ 1) {
    				attr_dev(svg, "class", /*seperateBarClass*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { seperateBarClass } = $$props;
    	const writable_props = ["seperateBarClass"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SeperateBar> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SeperateBar", $$slots, []);

    	$$self.$set = $$props => {
    		if ("seperateBarClass" in $$props) $$invalidate(0, seperateBarClass = $$props.seperateBarClass);
    	};

    	$$self.$capture_state = () => ({ seperateBarClass });

    	$$self.$inject_state = $$props => {
    		if ("seperateBarClass" in $$props) $$invalidate(0, seperateBarClass = $$props.seperateBarClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [seperateBarClass];
    }

    class SeperateBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { seperateBarClass: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SeperateBar",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*seperateBarClass*/ ctx[0] === undefined && !("seperateBarClass" in props)) {
    			console.warn("<SeperateBar> was created without expected prop 'seperateBarClass'");
    		}
    	}

    	get seperateBarClass() {
    		throw new Error("<SeperateBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set seperateBarClass(value) {
    		throw new Error("<SeperateBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/buttons/download/download.svelte generated by Svelte v3.21.0 */
    const file$m = "src/components/buttons/download/download.svelte";

    // (17:4) <Button       href="{URL}"       remove="font-medium bg-primary-500 hover:bg-primary-400"       add="flex flex-wrap bg-custom text-black"     >
    function create_default_slot$7(ctx) {
    	let t0;
    	let div;
    	let current;

    	const icon = new Icon$1({
    			props: { data: download, scale: "1.2" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    			t0 = space();
    			div = element("div");
    			div.textContent = `${/*BTNTEXT*/ ctx[1]}`;
    			attr_dev(div, "class", "ml-2");
    			add_location(div, file$m, 22, 6, 645);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(17:4) <Button       href=\\\"{URL}\\\"       remove=\\\"font-medium bg-primary-500 hover:bg-primary-400\\\"       add=\\\"flex flex-wrap bg-custom text-black\\\"     >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let div0;
    	let current;

    	const button = new Button({
    			props: {
    				href: /*URL*/ ctx[2],
    				remove: "font-medium bg-primary-500 hover:bg-primary-400",
    				add: "flex flex-wrap bg-custom text-black",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = `${/*TITLE*/ ctx[0]}`;
    			t1 = space();
    			div0 = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(h1, "class", " w-full my-2 text-2xl font-bold leading-tight text-center text-gray-800 capitalize dark:text-gray-100");
    			add_location(h1, file$m, 10, 2, 240);
    			attr_dev(div0, "class", "mx-auto flex justify-center my-6 py-4 px-8");
    			add_location(div0, file$m, 15, 2, 384);
    			attr_dev(div1, "class", "download-cv");
    			add_location(div1, file$m, 9, 0, 212);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(button, div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { cvData = {} } = $$props;
    	const { TITLE, BTNTEXT, URL } = cvData;
    	const writable_props = ["cvData"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Download> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Download", $$slots, []);

    	$$self.$set = $$props => {
    		if ("cvData" in $$props) $$invalidate(3, cvData = $$props.cvData);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		Icon: Icon$1,
    		download,
    		cvData,
    		TITLE,
    		BTNTEXT,
    		URL
    	});

    	$$self.$inject_state = $$props => {
    		if ("cvData" in $$props) $$invalidate(3, cvData = $$props.cvData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [TITLE, BTNTEXT, URL, cvData];
    }

    class Download extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { cvData: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Download",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get cvData() {
    		throw new Error("<Download>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cvData(value) {
    		throw new Error("<Download>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/containers/Home_container.svelte generated by Svelte v3.21.0 */
    const file$n = "src/containers/Home_container.svelte";

    function create_fragment$o(ctx) {
    	let section0;
    	let div2;
    	let div1;
    	let t0;
    	let div0;
    	let t1;
    	let t2;
    	let t3;
    	let section1;
    	let div3;
    	let t4;
    	let section2;
    	let div4;
    	let t5;
    	let section3;
    	let div5;
    	let t6;
    	let t7;
    	let section4;
    	let div6;
    	let current;

    	const avatar = new Avatar({
    			props: {
    				avatar: /*AVATAR*/ ctx[5],
    				avatarClass: "lg:hidden",
    				widthHeight: "128"
    			},
    			$$inline: true
    		});

    	const profil = new Profil({
    			props: {
    				profession: /*PROFESSION*/ ctx[6],
    				firstname: /*FIRSTNAME*/ ctx[7],
    				lastname: /*LASTNAME*/ ctx[8]
    			},
    			$$inline: true
    		});

    	const social = new Social({
    			props: {
    				socialData: /*socialData*/ ctx[0],
    				socialClass: "mx-auto lg:mx-0"
    			},
    			$$inline: true
    		});

    	const seperatebar0 = new SeperateBar({
    			props: {
    				seperateBarClass: "wave-top dark:bg-gray-900 bg-white"
    			},
    			$$inline: true
    		});

    	const skills = new Skills({
    			props: { skillsData: /*skillsData*/ ctx[1] },
    			$$inline: true
    		});

    	const tools = new Tools({
    			props: { toolsData: /*toolsData*/ ctx[2] },
    			$$inline: true
    		});

    	const trust = new Trust({
    			props: { trustData: /*trustData*/ ctx[3] },
    			$$inline: true
    		});

    	const seperatebar1 = new SeperateBar({
    			props: { seperateBarClass: "wave-bottom" },
    			$$inline: true
    		});

    	const download = new Download({
    			props: { cvData: /*cvData*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section0 = element("section");
    			div2 = element("div");
    			div1 = element("div");
    			create_component(avatar.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			create_component(profil.$$.fragment);
    			t1 = space();
    			create_component(social.$$.fragment);
    			t2 = space();
    			create_component(seperatebar0.$$.fragment);
    			t3 = space();
    			section1 = element("section");
    			div3 = element("div");
    			create_component(skills.$$.fragment);
    			t4 = space();
    			section2 = element("section");
    			div4 = element("div");
    			create_component(tools.$$.fragment);
    			t5 = space();
    			section3 = element("section");
    			div5 = element("div");
    			create_component(trust.$$.fragment);
    			t6 = space();
    			create_component(seperatebar1.$$.fragment);
    			t7 = space();
    			section4 = element("section");
    			div6 = element("div");
    			create_component(download.$$.fragment);
    			attr_dev(div0, "class", "flex flex-col w-full justify-center items-start text-center lg:text-left pb-4");
    			add_location(div0, file$n, 23, 8, 1216);
    			attr_dev(div1, "class", "profil-box dark:bg-gray-900 bg-white-500 rounded shadow px-4 py-8 lg:px-4 lg:py-4 mt-3 mx-3 flex flex-wrap flex-col lg:flex-row items-center delay-200 w-5/6 lg:w-auto\t svelte-19i398h");
    			add_location(div1, file$n, 21, 8, 950);
    			attr_dev(div2, "class", "container mx-auto flex flex-wrap flex-col lg:flex-row content-center");
    			add_location(div2, file$n, 20, 4, 859);
    			attr_dev(section0, "class", "profil mx-auto flex flex-wrap flex-col lg:flex-row items-center bg-black svelte-19i398h");
    			add_location(section0, file$n, 19, 0, 764);
    			attr_dev(div3, "class", "container mx-auto pt-4 pb-6");
    			add_location(div3, file$n, 38, 4, 1716);
    			attr_dev(section1, "class", "border-b pb-8 dark:bg-gray-900 dark:border-gray-800 bg-white");
    			add_location(section1, file$n, 37, 0, 1633);
    			attr_dev(div4, "class", "container mx-auto pt-4 pb-6");
    			add_location(div4, file$n, 43, 4, 1894);
    			attr_dev(section2, "class", "border-b py-8 bg-white dark:bg-gray-900 dark:border-gray-600");
    			add_location(section2, file$n, 42, 0, 1811);
    			attr_dev(div5, "class", "container mx-auto flex flex-wrap pt-4 pb-6");
    			add_location(div5, file$n, 48, 4, 2043);
    			attr_dev(section3, "class", "bg-gray-100 dark:bg-gray-800 py-8");
    			add_location(section3, file$n, 47, 0, 1987);
    			attr_dev(div6, "class", "container mx-auto");
    			add_location(div6, file$n, 56, 4, 2243);
    			attr_dev(section4, "class", "text-center py-6 pb-6");
    			add_location(section4, file$n, 55, 0, 2199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section0, anchor);
    			append_dev(section0, div2);
    			append_dev(div2, div1);
    			mount_component(avatar, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(profil, div0, null);
    			append_dev(div0, t1);
    			mount_component(social, div0, null);
    			insert_dev(target, t2, anchor);
    			mount_component(seperatebar0, target, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, section1, anchor);
    			append_dev(section1, div3);
    			mount_component(skills, div3, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, section2, anchor);
    			append_dev(section2, div4);
    			mount_component(tools, div4, null);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, section3, anchor);
    			append_dev(section3, div5);
    			mount_component(trust, div5, null);
    			insert_dev(target, t6, anchor);
    			mount_component(seperatebar1, target, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, section4, anchor);
    			append_dev(section4, div6);
    			mount_component(download, div6, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const social_changes = {};
    			if (dirty & /*socialData*/ 1) social_changes.socialData = /*socialData*/ ctx[0];
    			social.$set(social_changes);
    			const skills_changes = {};
    			if (dirty & /*skillsData*/ 2) skills_changes.skillsData = /*skillsData*/ ctx[1];
    			skills.$set(skills_changes);
    			const tools_changes = {};
    			if (dirty & /*toolsData*/ 4) tools_changes.toolsData = /*toolsData*/ ctx[2];
    			tools.$set(tools_changes);
    			const trust_changes = {};
    			if (dirty & /*trustData*/ 8) trust_changes.trustData = /*trustData*/ ctx[3];
    			trust.$set(trust_changes);
    			const download_changes = {};
    			if (dirty & /*cvData*/ 16) download_changes.cvData = /*cvData*/ ctx[4];
    			download.$set(download_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(avatar.$$.fragment, local);
    			transition_in(profil.$$.fragment, local);
    			transition_in(social.$$.fragment, local);
    			transition_in(seperatebar0.$$.fragment, local);
    			transition_in(skills.$$.fragment, local);
    			transition_in(tools.$$.fragment, local);
    			transition_in(trust.$$.fragment, local);
    			transition_in(seperatebar1.$$.fragment, local);
    			transition_in(download.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(avatar.$$.fragment, local);
    			transition_out(profil.$$.fragment, local);
    			transition_out(social.$$.fragment, local);
    			transition_out(seperatebar0.$$.fragment, local);
    			transition_out(skills.$$.fragment, local);
    			transition_out(tools.$$.fragment, local);
    			transition_out(trust.$$.fragment, local);
    			transition_out(seperatebar1.$$.fragment, local);
    			transition_out(download.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section0);
    			destroy_component(avatar);
    			destroy_component(profil);
    			destroy_component(social);
    			if (detaching) detach_dev(t2);
    			destroy_component(seperatebar0, detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(section1);
    			destroy_component(skills);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(section2);
    			destroy_component(tools);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(section3);
    			destroy_component(trust);
    			if (detaching) detach_dev(t6);
    			destroy_component(seperatebar1, detaching);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(section4);
    			destroy_component(download);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { headingProfilData = {} } = $$props;
    	const { AVATAR, PROFESSION, FIRSTNAME, LASTNAME } = headingProfilData;
    	let { socialData } = $$props;
    	let { skillsData } = $$props;
    	let { toolsData } = $$props;
    	let { trustData } = $$props;
    	let { cvData } = $$props;

    	const writable_props = [
    		"headingProfilData",
    		"socialData",
    		"skillsData",
    		"toolsData",
    		"trustData",
    		"cvData"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home_container> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Home_container", $$slots, []);

    	$$self.$set = $$props => {
    		if ("headingProfilData" in $$props) $$invalidate(9, headingProfilData = $$props.headingProfilData);
    		if ("socialData" in $$props) $$invalidate(0, socialData = $$props.socialData);
    		if ("skillsData" in $$props) $$invalidate(1, skillsData = $$props.skillsData);
    		if ("toolsData" in $$props) $$invalidate(2, toolsData = $$props.toolsData);
    		if ("trustData" in $$props) $$invalidate(3, trustData = $$props.trustData);
    		if ("cvData" in $$props) $$invalidate(4, cvData = $$props.cvData);
    	};

    	$$self.$capture_state = () => ({
    		Avatar,
    		Profil,
    		Social,
    		Skills,
    		Tools,
    		Trust,
    		SeperateBar,
    		Download,
    		headingProfilData,
    		AVATAR,
    		PROFESSION,
    		FIRSTNAME,
    		LASTNAME,
    		socialData,
    		skillsData,
    		toolsData,
    		trustData,
    		cvData
    	});

    	$$self.$inject_state = $$props => {
    		if ("headingProfilData" in $$props) $$invalidate(9, headingProfilData = $$props.headingProfilData);
    		if ("socialData" in $$props) $$invalidate(0, socialData = $$props.socialData);
    		if ("skillsData" in $$props) $$invalidate(1, skillsData = $$props.skillsData);
    		if ("toolsData" in $$props) $$invalidate(2, toolsData = $$props.toolsData);
    		if ("trustData" in $$props) $$invalidate(3, trustData = $$props.trustData);
    		if ("cvData" in $$props) $$invalidate(4, cvData = $$props.cvData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		socialData,
    		skillsData,
    		toolsData,
    		trustData,
    		cvData,
    		AVATAR,
    		PROFESSION,
    		FIRSTNAME,
    		LASTNAME,
    		headingProfilData
    	];
    }

    class Home_container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			headingProfilData: 9,
    			socialData: 0,
    			skillsData: 1,
    			toolsData: 2,
    			trustData: 3,
    			cvData: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home_container",
    			options,
    			id: create_fragment$o.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*socialData*/ ctx[0] === undefined && !("socialData" in props)) {
    			console.warn("<Home_container> was created without expected prop 'socialData'");
    		}

    		if (/*skillsData*/ ctx[1] === undefined && !("skillsData" in props)) {
    			console.warn("<Home_container> was created without expected prop 'skillsData'");
    		}

    		if (/*toolsData*/ ctx[2] === undefined && !("toolsData" in props)) {
    			console.warn("<Home_container> was created without expected prop 'toolsData'");
    		}

    		if (/*trustData*/ ctx[3] === undefined && !("trustData" in props)) {
    			console.warn("<Home_container> was created without expected prop 'trustData'");
    		}

    		if (/*cvData*/ ctx[4] === undefined && !("cvData" in props)) {
    			console.warn("<Home_container> was created without expected prop 'cvData'");
    		}
    	}

    	get headingProfilData() {
    		throw new Error("<Home_container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headingProfilData(value) {
    		throw new Error("<Home_container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get socialData() {
    		throw new Error("<Home_container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set socialData(value) {
    		throw new Error("<Home_container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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

    /* src/components/copyright/Copyright.svelte generated by Svelte v3.21.0 */

    const file$o = "src/components/copyright/Copyright.svelte";

    function create_fragment$p(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = `${/*TEXT*/ ctx[1]}`;
    			attr_dev(p, "class", "mt-2");
    			add_location(p, file$o, 7, 2, 149);
    			attr_dev(div, "class", /*copyrightClass*/ ctx[0]);
    			add_location(div, file$o, 6, 0, 116);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*copyrightClass*/ 1) {
    				attr_dev(div, "class", /*copyrightClass*/ ctx[0]);
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
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { copyrightData = {} } = $$props;
    	let { copyrightClass } = $$props;
    	const { TEXT } = copyrightData;
    	const writable_props = ["copyrightData", "copyrightClass"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Copyright> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Copyright", $$slots, []);

    	$$self.$set = $$props => {
    		if ("copyrightData" in $$props) $$invalidate(2, copyrightData = $$props.copyrightData);
    		if ("copyrightClass" in $$props) $$invalidate(0, copyrightClass = $$props.copyrightClass);
    	};

    	$$self.$capture_state = () => ({ copyrightData, copyrightClass, TEXT });

    	$$self.$inject_state = $$props => {
    		if ("copyrightData" in $$props) $$invalidate(2, copyrightData = $$props.copyrightData);
    		if ("copyrightClass" in $$props) $$invalidate(0, copyrightClass = $$props.copyrightClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [copyrightClass, TEXT, copyrightData];
    }

    class Copyright extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { copyrightData: 2, copyrightClass: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Copyright",
    			options,
    			id: create_fragment$p.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*copyrightClass*/ ctx[0] === undefined && !("copyrightClass" in props)) {
    			console.warn("<Copyright> was created without expected prop 'copyrightClass'");
    		}
    	}

    	get copyrightData() {
    		throw new Error("<Copyright>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set copyrightData(value) {
    		throw new Error("<Copyright>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get copyrightClass() {
    		throw new Error("<Copyright>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set copyrightClass(value) {
    		throw new Error("<Copyright>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/containers/Footer_container.svelte generated by Svelte v3.21.0 */
    const file$p = "src/containers/Footer_container.svelte";

    function create_fragment$q(ctx) {
    	let div;
    	let t;
    	let current;

    	const copyright = new Copyright({
    			props: {
    				copyrightData: /*copyrightData*/ ctx[0],
    				copyrightClass: "flex-1 text-xs order-2 lg:order-1"
    			},
    			$$inline: true
    		});

    	const social = new Social({
    			props: {
    				socialData: /*socialData*/ ctx[1],
    				socialClass: "flex-1 order-1 lg:order-2"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(copyright.$$.fragment);
    			t = space();
    			create_component(social.$$.fragment);
    			attr_dev(div, "class", "container mx-auto px-8 w-full flex flex-col md:flex-row py-5");
    			add_location(div, file$p, 9, 0, 212);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(copyright, div, null);
    			append_dev(div, t);
    			mount_component(social, div, null);
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
    			if (detaching) detach_dev(div);
    			destroy_component(copyright);
    			destroy_component(social);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { copyrightData: 0, socialData: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer_container",
    			options,
    			id: create_fragment$q.name
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

    /* src/App.svelte generated by Svelte v3.21.0 */
    const file$q = "src/App.svelte";

    function create_fragment$r(ctx) {
    	let header;
    	let t0;
    	let main;
    	let main_class_value;
    	let t1;
    	let footer;
    	let footer_class_value;
    	let current;

    	const header_container = new Header_container({
    			props: {
    				navlists: MOCK_DATA.NAVBAR_DATA,
    				switchBtn: MOCK_DATA.THEMESWITCH_DATA,
    				avatar: MOCK_DATA.PROFIL_DATA.AVATAR
    			},
    			$$inline: true
    		});

    	header_container.$on("message", /*handleMenuBtnAction*/ ctx[1]);

    	const home_container = new Home_container({
    			props: {
    				headingProfilData: MOCK_DATA.PROFIL_DATA,
    				socialData: MOCK_DATA.SOCIAL_DATA,
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
    			header = element("header");
    			create_component(header_container.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(home_container.$$.fragment);
    			t1 = space();
    			footer = element("footer");
    			create_component(footer_container.$$.fragment);
    			attr_dev(header, "class", "fixed w-full z-30 top-0 dark:bg-black bg-white bg-opacity-75 svelte-wb0oa1");
    			attr_dev(header, "id", "header");
    			add_location(header, file$q, 13, 0, 416);
    			attr_dev(main, "class", main_class_value = "lg:pt-16 " + (/*menuIsActive*/ ctx[0] ? "blur-block" : "") + " svelte-wb0oa1");
    			add_location(main, file$q, 16, 0, 666);
    			attr_dev(footer, "class", footer_class_value = "bg-dark-transLight " + (/*menuIsActive*/ ctx[0] ? "blur-block" : "") + " svelte-wb0oa1");
    			add_location(footer, file$q, 26, 0, 936);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			mount_component(header_container, header, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(home_container, main, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, footer, anchor);
    			mount_component(footer_container, footer, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*menuIsActive*/ 1 && main_class_value !== (main_class_value = "lg:pt-16 " + (/*menuIsActive*/ ctx[0] ? "blur-block" : "") + " svelte-wb0oa1")) {
    				attr_dev(main, "class", main_class_value);
    			}

    			if (!current || dirty & /*menuIsActive*/ 1 && footer_class_value !== (footer_class_value = "bg-dark-transLight " + (/*menuIsActive*/ ctx[0] ? "blur-block" : "") + " svelte-wb0oa1")) {
    				attr_dev(footer, "class", footer_class_value);
    			}
    		},
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
    			if (detaching) detach_dev(header);
    			destroy_component(header_container);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(home_container);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(footer);
    			destroy_component(footer_container);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let menuIsActive;

    	let handleMenuBtnAction = event => {
    		$$invalidate(0, menuIsActive = event.detail.toggleMenuBtnClick);
    	};

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
    		Footer_container,
    		menuIsActive,
    		handleMenuBtnAction
    	});

    	$$self.$inject_state = $$props => {
    		if ("menuIsActive" in $$props) $$invalidate(0, menuIsActive = $$props.menuIsActive);
    		if ("handleMenuBtnAction" in $$props) $$invalidate(1, handleMenuBtnAction = $$props.handleMenuBtnAction);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [menuIsActive, handleMenuBtnAction];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    var app = new App({
      target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
