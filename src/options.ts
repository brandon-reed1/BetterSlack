const form = document.getElementById('the-form');
form.addEventListener('submit', e => {
    e.preventDefault();

    var formData = new FormData(form as HTMLFormElement);
    var object: any = {};
    formData.forEach(function (value, key) {
        object[key] = value;
    });

    var json = JSON.stringify(object);

    chrome.storage.sync.set({
        'settings': json
    }, () => {
        chrome.tabs.query({url: 'https://*.slack.com/*'}, tabs => {
            tabs.filter(t => t.url.match(/^https:\/\/[^\.]+\.slack\.com/))
                .forEach(t => chrome.tabs.reload(t.id))
        });

        window.close()
    });
});

setTimeout(() => {
    chrome.storage.sync.get(['settings'], res => {
        const settings = JSON.parse(res.settings || '{}');

        let e: any = document.getElementById('hidden_ids');
        e.value = settings.hidden_ids || "";

        e = document.getElementById('hangout_url');
        e.value = settings.hangout_url || "";

        ['only_my_reactions', 'hide_gdrive_preview', 'threads_on_channel',
         'hide_status_emoji', 'reactions_on_the_right', 'hide_url_previews'].forEach(f=>{
            if(settings[f]) {
                document.getElementById(f).setAttribute('checked', 'true');
            }
        })
    })
}, 100)