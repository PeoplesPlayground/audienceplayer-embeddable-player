import EmbedPlayer from '../src/embed-player.js';
import ChromecastControls from '../src/chromecast-controls.js';

(function () {
    const urlQueryString = window.location.search;
    const urlParams = new URLSearchParams(urlQueryString);

    const articleId = +urlParams.get('articleId');
    const projectId = +urlParams.get('projectId');
    const assetId = +urlParams.get('assetId');
    const apiBaseUrl = urlParams.get('apiBaseUrl');
    const token = urlParams.get('token');
    const posterImageUrl = urlParams.get('posterImageUrl');
    const autoplay = urlParams.get('autoplay');
    const chromecastReceiverAppId = urlParams.get('chromecastReceiverAppId');

    const tokenParameter = token ? {token} : {};
    const posterImageUrlParameter = posterImageUrl ? {posterImageUrl} : {};

    const player = new EmbedPlayer();

    document.getElementById('video-button-start').addEventListener('click', playVideo);
    document.getElementById('video-button-stop').addEventListener('click', stopCastVideo);

    player.setupChromecast('#cast-wrapper', chromecastReceiverAppId);
    document.getElementById('cast-wrapper').style.display = 'unset';

    function playVideo() {
        if (player.isConnected()) {
            player
                .castVideo({
                    apiBaseUrl,
                    articleId,
                    projectId,
                    assetId,
                    ...tokenParameter,
                })
                .then(() => {
                    const controls = new ChromecastControls(player.getCastPlayer(), player.getCastPlayerController())
                })
                .catch((error) => console.error(error));
        } else {
            player
                .play({
                    selector: '.video-wrapper',
                    apiBaseUrl,
                    articleId,
                    projectId,
                    assetId,
                    ...tokenParameter,
                    ...posterImageUrlParameter,
                    autoplay: autoplay && autoplay === 'true',
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    function stopCastVideo() {
        player.stopCasting();
        player.destroy();
    }
})();
