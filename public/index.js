
(async () => {
    const HOST = location.origin;
    const CV_FILES_ROUTE = 'cv';
    const GET_CV_LIST = `${HOST}/list/cv`;
    const GET_PARSED = `${HOST}/parse/cv`;
    const url = new URL(location.href);
    
    const pdfsElement = document.getElementById('pdfs');
    const cvElement = document.getElementById('cv');
    const cvparsedmodal = document.getElementById('cvparsedmodal');
    const modalEl = document.getElementById('modal');
    const jsoneditorEl = document.getElementById('jsoneditor');

    function modal(open, content) {
        if(open) {
            modalEl.innerHTML = content;
            cvparsedmodal.classList.remove('close');
        } else if(!cvparsedmodal.classList.contains('close')) {
            cvparsedmodal.classList.add('close');
            modalEl.innerHTML = "";
        }
    }

    function initEditor() {
        const options = {
          mode: 'view'
        }
        const editor = new JSONEditor(jsoneditorEl, options);
        return editor;
    }
    const editor = initEditor();

    cvparsedmodal.addEventListener('click', event => {
        const bkdrp = event.target.getAttribute('id') === 'cvparsedmodal';
        if(bkdrp ) {
            modal(false);
        }
    });

    async function getCvList() {
        try {
            const result = await fetch(GET_CV_LIST);
            const list = await result.json();
            return list;
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    
    async function getParsed(path) {
        try {
            const result = await fetch(`${GET_PARSED}/${path}`);
            const parsed = await result.json();
            return parsed;
        } catch(e) {
            console.error(e);
            return [];
        }
    }

    const { result } = await getCvList();
    const htmlList = `
    <ul class="list-group">
        ${
            result.map(
                r => `<div
                    class="list-group-item d-flex justify-content-between">
                    <span>${r}</span>
                    <button 
                        class="btn"
                        data-action="parse-all"
                        data-data='${r}'>
                        <i class="bi bi-file-earmark-person"></i>
                    </button>
                </div>`
            ).join('')
        }
    </ul>
    `;

    const actions = {
        'show-editor': () => {
     
            if(!jsoneditorEl.classList.contains('show')) {
                jsoneditorEl.classList.add('show');
            }
        },
        'hide-editor': () => {
            jsoneditorEl.classList.remove('show');
        },
        'parse-all': async (path) => {
            const localParsedString = localStorage.getItem(path);
            let cvJson = {};
            const url = (`${HOST}/${CV_FILES_ROUTE}/${encodeURIComponent(path)}`);
            cvElement.src = url;
            if(localParsedString) {
                cvJson = JSON.parse(localParsedString);
            } else {
                jsoneditorEl.classList.add('loading');
                const { result } = await getParsed(path);
                jsoneditorEl.classList.remove('loading');
                cvJson = result;
                localStorage.setItem(path, JSON.stringify(cvJson)); 
            }

            console.log(cvJson);
            editor.set(cvJson);
    
        }
    };

    window.addEventListener('click', async event => {
        const el = event.target;
        const { data, action } = el?.dataset || {};
        const func = actions[action];
        console.log('action:', action);
        if(func) {
            func(data);
        }
    });

    pdfsElement.innerHTML = htmlList;

    const file = url.searchParams.get('file');
    if(file) {
        actions['parse-all'](file);
    }

})();