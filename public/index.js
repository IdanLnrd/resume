(async () => {
    const HOST = location.origin;
    const GET_CV_LIST = `${HOST}/list/cv`;
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
    
    const cvs = await getCvList();
    console.log({cvs});
})();