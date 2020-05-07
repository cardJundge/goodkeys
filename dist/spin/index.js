Component({
    externalClasses: ['i-class'],

    properties: {
        // small || default || large
        size: {
            type: String,
            value: 'default'
        },
        fix: {
            type: Boolean,
            value: false
        },
        fullscreen: {
            type: Boolean,
            value: true
        },
        custom: {
            type: Boolean,
            value: false
        }
    }
});
