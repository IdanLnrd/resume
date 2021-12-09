function initEditor() {
    const container = document.getElementById('jsoneditor')

    const options = {
      mode: 'view'
    }
  
    const editor = new JSONEditor(container, options);
    return editor;
}
(async () => {
    const HOST = location.origin;
    const CV_FILES_ROUTE = 'cv';
    const GET_CV_LIST = `${HOST}/list/cv`;
    const GET_PARSED = `${HOST}/parse/cv`;
    const editor = initEditor();
    const pdfsElement = document.getElementById('pdfs');
    const cvElement = document.getElementById('cv');
    const cvparsedmodal = document.getElementById('cvparsedmodal');
    const modalEl = document.getElementById('modal');
    function modal(open, content) {
        if(open) {
            modalEl.innerHTML = content;
            cvparsedmodal.classList.remove('close');
        } else if(!cvparsedmodal.classList.contains('close')) {
            cvparsedmodal.classList.add('close');
            modalEl.innerHTML = "";
        }
    }

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
        'parse-all': async (path) => {
            const localParsedString = localStorage.getItem(path);
            let cvJson = {};
            const url = (`${HOST}/${CV_FILES_ROUTE}/${encodeURIComponent(path)}`);
            cvElement.src = url;
            if(localParsedString) {
                cvJson = JSON.parse(localParsedString);
            } else {
                const { result } = await getParsed(path);
                cvJson = result;
                localStorage.setItem(path, JSON.stringify(cvJson)); 
            }

            console.log(cvJson);
            editor.set(cvJson);
            const html = `
                <div>done!</div>
            `;

            return modal(true, html);
        }
    };

    pdfsElement.addEventListener('click', async event => {
        const el = event.target;
        const { data, action } = el?.dataset || {};
        const func = actions[action];
        if(func) {
            func(data);
        }
    });

    pdfsElement.innerHTML = htmlList;


})();