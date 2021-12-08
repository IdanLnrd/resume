(async () => {
    const HOST = location.origin;
    const CV_FILES_ROUTE = 'cv';
    const GET_CV_LIST = `${HOST}/list/cv`;
    const GET_PARSED = `${HOST}/parse/cv`;

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
                r => `<button 
                    type="button" 
                    data-path='${r}'
                    class="list-group-item 
                    list-group-item-action">${r}</button>`
            ).join('')
        }
    </ul>
    `;



    pdfsElement.addEventListener('click', async event => {
        const el = event.target;
        const { path } = el?.dataset || {};
        if(path) {
            let parsed = localStorage.getItem(path)
            const url = (`${HOST}/${CV_FILES_ROUTE}/${encodeURIComponent(path)}`);
            cvElement.src = url;
            if(!parsed) {
                
                const { result } = await getParsed(path);
          
                localStorage.setItem(path, result); 
                parsed = result;
            }

            const obj = JSON.parse(parsed);

            console.log(obj, result);

            const html = `
                ${
                    Object.keys(obj).map(k => `
                        <div class="m-2">
                            <span class="mx-2">${k}: </span>
                            <span class="">${obj[k]}</span>
                        </div>
                    `).join('')
                }
            `;

            return modal(true, html);
        }
    });

    pdfsElement.innerHTML = htmlList;


})();