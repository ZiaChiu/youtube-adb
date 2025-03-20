// ==UserScript==
// @name         youtube-adb
// @name:zh-CN   YouTube去广告
// @name:zh-TW   YouTube去廣告
// @name:zh-HK   YouTube去廣告
// @name:zh-MO   YouTube去廣告
// @namespace    https://github.com/iamfugui/youtube-adb
// @version      6.22
// @description  A script to remove YouTube ads, including static ads and video ads, without interfering with the network and ensuring safety.
// @description:zh-CN   脚本用于移除YouTube广告，包括静态广告和视频广告。不会干扰网络，安全。
// @description:zh-TW   腳本用於移除 YouTube 廣告，包括靜態廣告和視頻廣告。不會干擾網路，安全。
// @description:zh-HK   腳本用於移除 YouTube 廣告，包括靜態廣告和視頻廣告。不會干擾網路，安全。
// @description:zh-MO   腳本用於移除 YouTube 廣告，包括靜態廣告和視頻廣告。不會干擾網路，安全。
// @match        *://*.youtube.com/*
// @exclude      *://accounts.youtube.com/*
// @exclude      *://www.youtube.com/live_chat_replay*
// @exclude      *://www.youtube.com/persist_identity*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @grant        none
// @license      MIT
// @downloadURL  https://update.greasyfork.org/scripts/459541/YouTube%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL    https://update.greasyfork.org/scripts/459541/YouTube%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    `use strict`;

    let video;
    //界面广告选择器
    const cssSelectorArr = [
        "#masthead-ad", //首页顶部横幅广告.
        "ytd-rich-item-renderer.style-scope.ytd-rich-grid-row #content:has(.ytd-display-ad-renderer)", //首页视频排版广告.
        ".video-ads.ytp-ad-module", //播放器底部广告.
        "tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)", //播放页会员促销广告.
        'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]', //播放页右上方推荐广告.
        "#related #player-ads", //播放页评论区右侧推广广告.
        "#related ytd-ad-slot-renderer", //播放页评论区右侧视频排版广告.
        "ytd-ad-slot-renderer", //搜索页广告.
        "yt-mealbar-promo-renderer", //播放页会员推荐广告.
        "ytd-popup-container:has(a[href=\"/premium\"])", //会员拦截广告
        "ad-slot-renderer", //M播放页第三方推荐广告
        "ytm-companion-ad-renderer", //M可跳过的视频广告链接处
    ];
    window.dev = false; //开发使用时可设为true

    /**
     * 将标准时间格式化
     * @param {Date} time 标准时间
     * @return {String}
     */
    function moment(time) {
        // 获取年⽉⽇时分秒
        let y = time.getFullYear();
        let m = (time.getMonth() + 1).toString().padStart(2, "0");
        let d = time.getDate().toString().padStart(2, "0");
        let h = time.getHours().toString().padStart(2, "0");
        let min = time.getMinutes().toString().padStart(2, "0");
        let s = time.getSeconds().toString().padStart(2, "0");
        return `${y}-${m}-${d} ${h}:${min}:${s}`;
    }

    /**
     * 输出信息
     * @param {String} msg 信息
     */
    function log(msg) {
        if (!window.dev) return;
        console.log(window.location.href);
        console.log(`${moment(new Date())}  ${msg}`);
    }

    /**
     * 设置运行标志
     * @param {String} name
     */
    function setRunFlag(name) {
        let style = document.createElement("style");
        style.id = name;
        (document.head || document.body).appendChild(style); //将节点附加到HTML.
    }

    /**
     * 获取运行标志
     * @param {String} name
     * @return {Element|null}
     */
    function getRunFlag(name) {
        return document.getElementById(name);
    }

    /**
     * 检查是否设置了运行标志
     * @param {String} name
     * @return {Boolean}
     */
    function checkRunFlag(name) {
        if (getRunFlag(name)) {
            return true;
        } else {
            setRunFlag(name);
            return false;
        }
    }

    /**
     * 生成去除广告的css元素style并附加到HTML节点上
     * @param {String} id
     */
    function generateRemoveADHTMLElement(id) {
        if (checkRunFlag(id)) {
            log("屏蔽页面广告节点已生成");
            return false;
        }

        //设置移除广告样式.
        let style = document.createElement("style");
        (document.head || document.body).appendChild(style);
        style.appendChild(
            document.createTextNode(generateRemoveADCssText(cssSelectorArr))
        );
        log("生成屏蔽页面广告节点成功");
    }

    /**
     * 生成去除广告的css文本
     * @param {Array} cssSelectorArr 待设置css选择器数组
     * @return {String}
     */
    function generateRemoveADCssText(cssSelectorArr) {
        cssSelectorArr.forEach((selector, index) => {
            cssSelectorArr[index] = `${selector}{display:none!important}`;
        });
        return cssSelectorArr.join(" ");
    }

    /**
     * 触摸事件
     * @return {undefined}
     */
    function nativeTouch() {
        try {
            // 创建 Touch 对象
            let touch = new Touch({
                identifier: Date.now(),
                target: this,
                clientX: 12,
                clientY: 34,
                radiusX: 56,
                radiusY: 78,
                rotationAngle: 0,
                force: 1
            });

            // 创建 TouchEvent 对象
            let touchStartEvent = new TouchEvent("touchstart", {
                bubbles: true,
                cancelable: true,
                view: window,
                touches: [touch],
                targetTouches: [touch],
                changedTouches: [touch]
            });
            this.dispatchEvent(touchStartEvent);

            // 创建 TouchEvent 对象
            let touchEndEvent = new TouchEvent("touchend", {
                bubbles: true,
                cancelable: true,
                view: window,
                touches: [],
                targetTouches: [],
                changedTouches: [touch]
            });
            // 分派 touchend 事件到目标元素
            this.dispatchEvent(touchEndEvent);
        } catch (e) {
            // Some browsers may block synthetic TouchEvent
            console.error("nativeTouch error:", e);
        }
    }

    /**
     * 获取dom
     */
    function getVideoDom() {
        video = document.querySelector(".ad-showing video") || document.querySelector("video");
    }

    /**
     * 自动播放
     */
    function playAfterAd() {
        if (video && video.paused && video.currentTime < 1) {
            video.play();
            log("自动播放视频");
        }
    }

    /**
     * 移除YT拦截广告拦截弹窗并且关闭遮罩层
     */
    function closeOverlay() {
        // 移除YT拦截广告拦截弹窗
        const premiumContainers = [...document.querySelectorAll("ytd-popup-container")];
        const matchingContainers = premiumContainers.filter(container =>
            container.querySelector('a[href="/premium"]')
        );
        if (matchingContainers.length > 0) {
            matchingContainers.forEach(container => container.remove());
            log("移除YT拦截器");
        }

        // 获取所有具有指定标签的元素
        const backdrops = document.querySelectorAll("tp-yt-iron-overlay-backdrop");
        // 查找具有特定样式的元素
        const targetBackdrop = Array.from(backdrops).find(
            backdrop => backdrop.style.zIndex === "2201"
        );
        // 如果找到该元素，清空其类并移除 open 属性
        if (targetBackdrop) {
            targetBackdrop.className = "";
            targetBackdrop.removeAttribute("opened");
            log("关闭遮罩层");
        }
    }

    /**
     * 跳过广告
     */
    function skipAd() {
        if (!video) return;
        const skipButton =
            document.querySelector(".ytp-ad-skip-button") ||
            document.querySelector(".ytp-skip-ad-button") ||
            document.querySelector(".ytp-ad-skip-button-modern");
        const shortAdMsg =
            document.querySelector(".video-ads.ytp-ad-module .ytp-ad-player-overlay") ||
            document.querySelector(".ytp-ad-button-icon");

        if ((skipButton || shortAdMsg) && window.location.href.indexOf("https://m.youtube.com/") === -1) {
            video.muted = true;
        }

        if (skipButton) {
            const delayTime = 0.5;
            // 递归 setTimeout 再次检测
            setTimeout(skipAd, delayTime * 1000);

            if (video.currentTime > delayTime) {
                video.currentTime = video.duration; // 强制
                log("特殊账号跳过按钮广告");
                return;
            }
            skipButton.click(); // PC
            nativeTouch.call(skipButton); // Mobile
            log("按钮跳过广告");
        } else if (shortAdMsg) {
            video.currentTime = video.duration; // 强制
            log("强制结束了该广告");
        }
    }

    /**
     * 去除播放中的广告
     */
    function removePlayerAD(id) {
        if (checkRunFlag(id)) {
            log("去除播放中的广告功能已在运行");
            return false;
        }
        // 监听视频中的广告并处理
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        const observer = new MutationObserver(() => {
            getVideoDom();
            closeOverlay();
            skipAd();
            playAfterAd();
        });
        observer.observe(targetNode, config);
        log("运行去除播放中的广告功能成功");
    }

    /**
     * main函数
     */
    function main() {
        generateRemoveADHTMLElement("removeADHTMLElement"); //移除界面中的广告
        removePlayerAD("removePlayerAD"); //移除播放中的广告
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", main);
        log("YouTube去广告脚本即将调用:");
    } else {
        main();
        log("YouTube去广告脚本快速调用:");
    }

    // -----------------------------------
    // ADDITIONAL CODE TO REMOVE POPUPS
    // -----------------------------------

    function resumeVideo() {
        const videoelem = document.body.querySelector("video.html5-main-video");
        if (videoelem && videoelem.paused) {
            console.log("resume video");
            videoelem.play();
        }
    }

    function removePop(node) {
        // If there's an enforcement popup
        const elpopup = node.querySelector(
            ".ytd-popup-container > .ytd-popup-container > .ytd-enforcement-message-view-model"
        );
        if (elpopup) {
            elpopup.parentNode.remove();
            console.log("remove popup", elpopup);
            const bdelems = document.getElementsByTagName("tp-yt-iron-overlay-backdrop");
            for (let x = (bdelems || []).length; x--; ) {
                bdelems[x].remove();
            }
            resumeVideo();
        }

        // If it's a backdrop
        if (node.tagName && node.tagName.toLowerCase() === "tp-yt-iron-overlay-backdrop") {
            node.remove();
            resumeVideo();
            console.log("remove backdrop", node);
        }

        // If it's the main ytd-popup-container (often with z-index 2222)
        if (node.tagName && node.tagName.toLowerCase() === "ytd-popup-container") {
            // You can filter if you only want to remove specific popups.
            // For now, remove them all to prevent scroll-block issues.
            node.remove();
            resumeVideo();
            console.log("remove ytd-popup-container", node);
        }
    }

    let obs = new MutationObserver(mutations =>
        mutations.forEach(mutation => {
            if (mutation.type === "childList") {
                Array.from(mutation.addedNodes)
                    .filter(node => node.nodeType === 1)
                    .forEach(node => removePop(node));
            }
        })
    );

    obs.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
