window.addEventListener('load', function() {

    var form = document.querySelector('form');
    var error = form.querySelector('.error');
    form.addEventListener('submit', function(e) {
        e.stopPropagation();
        e.preventDefault();

        var data = {};
        var formData = new FormData(form);
        formData.forEach(function (value, key) {
            data[key] = value;
        });
        var body = JSON.stringify(data);

        fetch('/subscribe', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body
        })
        .then(function(r) {
            var response = r.json().then(_r => {
                if (!r.ok) error.innerHTML = _r.message;
                else {
                    error.innerHTML = '';
                    form.classList.add('success');
                }
            });
        })

        return false;
    });
});
