module.exports = {
    "plugins": [
        "@stylistic/js"
    ],
    "env": {
        "node": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "@stylistic/js/indent": [
            "error",
            4
        ],
        "@stylistic/js/linebreak-style": [
            "error",
            "windows"
        ],
        "@stylistic/js/quotes": [
            "error",
            "double"
        ],
        "@stylistic/js/semi": [
            "error",
            "never"
        ],"no-trailing-spaces": "error",
        "object-curly-spacing": [
            "error", "always"
        ],
        "arrow-spacing": [
            "error", { "before": true, "after": true }
        ],
        "eqeqeq": "error",
        "no-console": 0
    }
}
