import { css, Global } from '@emotion/react';
import { colors } from './theme/colors';

const style = css`
    html,
    body {
        margin: 0;
        padding: 0;
        background-color: ${colors.background};
    }

    * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        font-family: sans-serif;
        font-size: 1rem;
        color: ${colors.text};
    }

    a {
        text-decoration: none;
        color: ${colors.text};
    }

    button {
        user-select: none;
        border: none;
        cursor: pointer;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        color: ${colors.text};
        line-height: 1rem;
        transition: background-color 0.3s ease;
    }

    label {
        width: 100%;
    }
    input {
        background: none;
        color: ${colors.text};
        font-size: 1rem;
        border: none;
        width: 100%;
    }

    strong,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p {
        margin: 0;
        padding: 0;
    }

    // @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css');

    // * {
    //     box-sizing: border-box;
    //     text-decoration: none;
    //     list-style: none;
    //     margin: 0;
    //     padding: 0;
    //     font-family: 'Pretendard', Pretendard;
    //     font-style: normal;
    //     user-select: auto;
    //     -webkit-touch-callout: none;
    //     -webkit-text-size-adjust: auto;
    // }

    // html {
    //     margin: 0;
    //     padding: 0;
    // }

    // body {
    //     display: block;
    //     margin: 0;
    //     padding: 0;
    //     width: 100%;
    //     height: 100%;
    //     text-rendering: optimizeLegibility;
    //     overflow-x: hidden;
    //     overflow-y: auto;
    //     word-break: break-all;
    //     word-wrap: break-word;
    //     overflow-wrap: break-word;
    // }

    // @supports (-webkit-touch-callout: none) {
    //     html,
    //     body,
    //     #layout {
    //         height: -webkit-fill-available;
    //     }
    // }

    // a {
    //     display: flex;
    //     align-items: center;
    //     text-decoration: none;
    //     color: #4e4e51;
    //     cursor: pointer;
    //     white-space: nowrap;
    //     transition: 0.3s ease-in-out;
    // }

    // ul,
    // li {
    //     display: flex;
    //     list-style: none;
    //     padding: 0;
    //     margin: 0;
    // }

    // button {
    //     display: flex;
    //     background-color: transparent;
    //     outline: none;
    //     border: none;
    //     cursor: pointer;
    //     font-size: 1rem;
    //     width: auto;
    //     color: #4e4e51;
    //     transition: all 0.3s ease-in-out;
    // }

    // svg,
    // img,
    // picture {
    //     transition: all 0.3s ease-in-out;
    // }

    // /* Custom Scrollbar Styles */
    // ::-webkit-scrollbar {
    //     width: 10px;
    //     height: 10px;
    // }
    // ::-webkit-scrollbar-track {
    //     background-color: transparent;
    // }
    // ::-webkit-scrollbar-thumb {
    //     background-color: #666;
    //     border-radius: 100px;
    // }
    // ::-webkit-scrollbar-thumb:hover {
    //     background: #e2e2e2;
    // }

    /* Input Styles */
    // input,
    // textarea,
    // select {
    //     border: none;
    //     outline: none;
    //     text-decoration: none;
    //     background-color: transparent;
    //     resize: none;
    // }

    // input[type='checkbox'],
    // input[type='radio'] {
    //     cursor: pointer;
    // }

    // select {
    //     -webkit-appearance: none;
    //     appearance: none;
    //     cursor: pointer;
    // }

    // select::-ms-expand {
    //     display: none;
    // }

    // input::-webkit-search-decoration,
    // input::-webkit-search-cancel-button,
    // input::-webkit-search-results-button,
    // input::-webkit-search-results-decoration {
    //     display: none;
    // }
`;

export function GlobalTheme() {
    return <Global styles={style} />;
}
