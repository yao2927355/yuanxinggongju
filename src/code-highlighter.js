class CodeHighlighter {
    constructor() {
        this.loadPrism();
    }

    loadPrism() {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js';
        document.head.appendChild(script);

        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism.min.css';
        document.head.appendChild(css);
    }

    highlight(code, language = 'javascript') {
        return Prism.highlight(code, Prism.languages[language], language);
    }
} 