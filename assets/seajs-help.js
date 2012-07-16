seajs.config({
    alias: {
        '$': 'jquery/1.7.2/jquery',
        'jquery': 'jquery/1.7.2/jquery',
        'zepto': 'zepto/0.9.0/zepto',
        'json': 'json/1.0.2/json',
        'jasmine': 'jasmine/1.1.0/jasmine-html'
    },
    map: [
        [/^(?:#|[a-z\d-]*\/)[a-z\d-]*\/\d+\.\d+\.\d+\/([a-z\d-]*)$/g, '../src/$1']
    ],
    preload: [
        this.JSON ? '' : 'json',
        'seajs/plugin-json',
        'seajs/plugin-text'
    ]
});

(function() {
    var isSetAlias = false;
    var use = seajs.use;
    seajs.use = function(ids, callback) {
        use.call(seajs, ['../package.json'], function(data) {
            if (data.moduleDependencies && !isSetAlias) {
                seajs.config({
                    alias: data.moduleDependencies
                });
                isSetAlias = true;
            }
            use.call(seajs, ids, callback);
        });
    }
})();
