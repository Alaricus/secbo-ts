(this["webpackJsonpsecbo-ts"]=this["webpackJsonpsecbo-ts"]||[]).push([[0],{10:function(e,t,a){"use strict";a.r(t);var n=a(1),i=a.n(n),r=a(3),s=a.n(r),l=(a(8),a(0));var o=e=>{const{updateCanvas:t,imageInfo:a,setImageInfo:n,readAlpha:i,textToBinary:r}=e;return Object(l.jsx)("div",{className:"ImageUploader",onDrop:e=>{e.preventDefault();const s=new FileReader,l=new Image,o=e.dataTransfer.files[0];"image/png"===o.type?s.readAsDataURL(o):console.log("Invalid format. Use a PNG image."),s.onload=e=>{try{l.onload=()=>{t(l),n({...a,image:l,name:o.name,text:i()||"",binary:r(i()||"")})},l.src=(null===e||void 0===e?void 0:e.target)?e.target.result:""}catch(s){console.log("File failed to load.")}}},onDragEnter:e=>e.preventDefault(),onDragOver:e=>e.preventDefault(),children:a.image?Object(l.jsx)("img",{className:"ImagePreview",src:a.image.src,alt:"thumbnail"}):Object(l.jsx)("span",{children:"drag an image file here"})})};var c=e=>{const{imageInfo:t,pixels:a,freePixels:n}=e;return Object(l.jsxs)("div",{className:"Details",children:[t.image&&`${a} total pixels, `,Object(l.jsx)("span",{style:{color:n>0?"black":"red"},children:t.image&&`${n} still available`})]})};var d=()=>{var e,t;const a=Object(n.useRef)(null),[i,r]=Object(n.useState)(!1),[s,d]=Object(n.useState)({text:"",binary:"",image:null,name:"",dl:""}),[g,u]=Object(n.useState)(0),[h,m]=Object(n.useState)(0);let b=null;a.current&&(b=a.current.getContext("2d"));Object(n.useEffect)((()=>{a.current&&!i&&r(!0)}),[a]),Object(n.useEffect)((()=>{if(null===s||void 0===s?void 0:s.image){const e=s.image.width*s.image.height,t=e-s.binary.length;u(e),m(t)}}),[s.text,s.binary,s.image]);const v=e=>`[secbo]${e}[/secbo]`.split("").map((e=>`${e.charCodeAt(0).toString(2)} `)).join(""),j=e=>{var t;(e=>{if(b){const t=b.getImageData(0,0,b.canvas.width,b.canvas.height);t.data.length/4>=e.length?(t.data.forEach(((e,a)=>{a>0&&(a+1)%4===0&&(t.data[a]=255)})),e.split("").forEach(((e,a)=>{"1"===e&&(t.data[4*a+3]=254)," "===e&&(t.data[4*a+3]=253)})),b.putImageData(t,0,0)):alert("The image was too small to contain all this data.")}})(v(e.target.value)),d({...s,text:e.target.value,binary:v(e.target.value),dl:(null===(t=a.current)||void 0===t?void 0:t.toDataURL("image/png"))||""})};return Object(l.jsxs)("div",{className:"App",children:[Object(l.jsx)("h2",{children:"secbo"}),Object(l.jsx)(o,{updateCanvas:e=>{b&&(b.canvas.width=e.width,b.canvas.height=e.height,b.drawImage(e,0,0))},imageInfo:s,setImageInfo:d,readAlpha:()=>{if(b){const e=(e=>e.split(" ").map((e=>String.fromCharCode(parseInt(e,2)))).join(""))(b.getImageData(0,0,b.canvas.width,b.canvas.height).data.reduce(((e,t,a)=>{if(a>0&&(a+1)%4===0){if(253===t){return`${e} `}if(254===t){return`${e}1`}if(255===t){return`${e}0`}}return e}),""));if(e.startsWith("[secbo]")&&e.substring(0,e.length-1).endsWith("[/secbo]"))return e.substring(7,e.length-9)}return null},textToBinary:v}),Object(l.jsx)(c,{imageInfo:s,pixels:g,freePixels:h}),Object(l.jsx)("textarea",{rows:15,cols:50,value:s.text,onChange:e=>j(e)}),s.text.length>0&&(null===s||void 0===s||null===(e=s.image)||void 0===e?void 0:e.src)&&h>=0&&Object(l.jsx)("a",{role:"button",href:s.dl,download:s.name,children:"download"}),(null===s||void 0===s||null===(t=s.image)||void 0===t?void 0:t.src)&&Object(l.jsx)("button",{type:"button",onClick:()=>{d({text:"",binary:"1011011 1110011 1100101 1100011 1100010 1101111 1011101  1011011 101111 1110011 1100101 1100011 1100010 1101111 1011101",image:null,name:"",dl:""})},children:"clear"}),Object(l.jsx)("canvas",{ref:a})]})};var g=e=>{e&&e instanceof Function&&a.e(3).then(a.bind(null,11)).then((({getCLS:t,getFID:a,getFCP:n,getLCP:i,getTTFB:r})=>{t(e),a(e),n(e),i(e),r(e)}))};s.a.render(Object(l.jsx)(i.a.StrictMode,{children:Object(l.jsx)(d,{})}),document.getElementById("root")),g()},8:function(e,t,a){}},[[10,1,2]]]);
//# sourceMappingURL=main.4f8d31b6.chunk.js.map