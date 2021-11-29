(async () => {
    const HOST = location.origin;
    const CV_FILES_ROUTE = 'cv';
    const GET_CV_LIST = `${HOST}/list/cv`;
    const pdfsElement = document.getElementById('pdfs');
    const cvElement = document.getElementById('cv');
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

    pdfsElement.addEventListener('click', event => {
        const el = event.target;
        const { path } = el?.dataset || {};
        if(path) {
            const url = (`${HOST}/${CV_FILES_ROUTE}/${encodeURIComponent(path)}`);
            cvElement.src = url;
        }
    });

    pdfsElement.innerHTML = htmlList;


})();