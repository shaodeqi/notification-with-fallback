type FallbackType = 'alert' | 'confirm';
type NotificationDir = 'auto' | 'ltr' | 'rtl';

interface Options {
    sound?: string;
    body?: string;
    icon?: string;
    tag?: string;
    dir?: NotificationDir;
    lang?: string;
    soundHack?: boolean;
    fallbackType?: FallbackType;
    fallbackForce?: boolean;
    fallbackTemplate?: string;
    fallbackDelay?: number;
    fallbackWhenDenied?: boolean;
    focusOnClick?: boolean;
    pauseSoundOnClick?: boolean;
    pauseSoundOnClose?: boolean;
} 
class WebNotification {
    public audio: HTMLMediaElement
    public isFallback: boolean
    public isDenied: boolean
    public close () {}
    public onshow: () => {}
    public onclick: () => {}
    public onclose: () => {}
    public onerror: () => {}

    private _soundHack (options: Options):void {
        if (options.sound && 'Audio' in window) {
            this.audio = new Audio(options.sound);
            let playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {})
            }
            delete options.sound;
        }
    }

    private _fallback (title: string, options: Options) {
        this.isFallback = true;
        if (typeof this.fallback === 'function') {
            this.fallback(title, options);
        }
    }

    public pauseSound (audio: HTMLMediaElement):void {
        if (audio && audio.pause) {
            audio.pause();
            audio = null;
        }
    }

    public fallback (title: string, options: Options) {        
        let { fallbackType = 'confirm', fallbackTemplate = 'title: body', fallbackDelay = 1000, pauseSoundOnClick = false, pauseSoundOnClose = false } = options;

        setTimeout(() => {
            let _alertContent;
            let _alertResult;

            _alertContent = fallbackTemplate.replace(/title/g, title).replace(/body/g, options.body);
            
            if (this.onshow) {
                this.onshow();
            }
            if (fallbackType === 'alert') {
                _alertResult = alert(_alertContent);
            } else {
                _alertResult = confirm(_alertContent);
            }

            if (_alertResult) {
                if (pauseSoundOnClick) {
                    this.pauseSound(this.audio);
                }
                if (typeof this.onclick === 'function') {
                    this.onclick();
                }
            } else {
                if (pauseSoundOnClose) {
                    this.pauseSound(this.audio);
                }
                if (typeof this.onclose === 'function') {
                    this.onclose();
                }
            }
        }, fallbackDelay)
    }
    
    constructor (title: string, options: Options) {
        let { fallbackForce = false, fallbackWhenDenied = true, focusOnClick = true, soundHack = true, pauseSoundOnClick = false, pauseSoundOnClose = false } = options;

        if (soundHack) {
            this._soundHack(options);
        }

        if ('Notification' in window && !fallbackForce) {
            Notification.requestPermission(_permission => {
                if (_permission === 'granted') {
                    this.isFallback = false;
                    let _notificationInstance = new Notification(title, options);

                    _notificationInstance.onclick = () => {
                        if (focusOnClick) {
                            window.focus();
                        }
                        if (pauseSoundOnClick) {
                            this.pauseSound(this.audio);
                        }
                        if (typeof this.onclick === 'function') {
                            this.onclick.apply(this, arguments);
                        }
                    };
                    if (typeof this.onclose === 'function') {
                        _notificationInstance.onclose = () => {
                            if (pauseSoundOnClose) {
                                this.pauseSound(this.audio);
                            }
                            if (typeof this.onclose === 'function') {
                                this.onclose.apply(this, arguments);
                            }
                        };
                    }
                    if (typeof this.onshow === 'function') {
                        _notificationInstance.onshow = this.onshow.bind(this);
                    }
                    if (typeof this.onerror === 'function') {
                        _notificationInstance.onerror = this.onerror.bind(this);
                    }
                    this.close = _notificationInstance.close.bind(_notificationInstance);
                } else if (_permission === 'denied') {
                    this.isDenied = true;
                    if (fallbackWhenDenied) {
                        this._fallback(title, options);
                    }
                } else {
                    this._fallback(title, options);
                }
            })
        } else {
            this._fallback(title, options);
        }
    }
}

export default WebNotification;