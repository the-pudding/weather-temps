function E(){}const V=t=>t;function xt(t,e){for(const n in e)t[n]=e[n];return t}function ct(t){return t()}function st(){return Object.create(null)}function A(t){t.forEach(ct)}function H(t){return typeof t=="function"}function Gt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function $t(t){return Object.keys(t).length===0}function vt(t,...e){if(t==null)return E;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Jt(t,e,n){t.$$.on_destroy.push(vt(e,n))}function Kt(t,e,n,i){if(t){const r=lt(t,e,n,i);return t[0](r)}}function lt(t,e,n,i){return t[1]&&i?xt(n.ctx.slice(),t[1](i(e))):n.ctx}function Qt(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const c=[],s=Math.max(e.dirty.length,r.length);for(let l=0;l<s;l+=1)c[l]=e.dirty[l]|r[l];return c}return e.dirty|r}return e.dirty}function Ut(t,e,n,i,r,c){if(r){const s=lt(e,n,i,c);t.p(s,r)}}function Vt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function Xt(t){return t==null?"":t}function Yt(t,e,n){return t.set(n),e}const at=typeof window!="undefined";let X=at?()=>window.performance.now():()=>Date.now(),Y=at?t=>requestAnimationFrame(t):E;const S=new Set;function ut(t){S.forEach(e=>{e.c(t)||(S.delete(e),e.f())}),S.size!==0&&Y(ut)}function Z(t){let e;return S.size===0&&Y(ut),{promise:new Promise(n=>{S.add(e={c:t,f:n})}),abort(){S.delete(e)}}}let G=!1;function kt(){G=!0}function Et(){G=!1}function At(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function St(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const o=[];for(let a=0;a<e.length;a++){const d=e[a];d.claim_order!==void 0&&o.push(d)}e=o}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let o=0;o<e.length;o++){const a=e[o].claim_order,d=(r>0&&e[n[r]].claim_order<=a?r+1:At(1,r,u=>e[n[u]].claim_order,a))-1;i[o]=n[d]+1;const f=d+1;n[f]=o,r=Math.max(f,r)}const c=[],s=[];let l=e.length-1;for(let o=n[r]+1;o!=0;o=i[o-1]){for(c.push(e[o-1]);l>=o;l--)s.push(e[l]);l--}for(;l>=0;l--)s.push(e[l]);c.reverse(),s.sort((o,a)=>o.claim_order-a.claim_order);for(let o=0,a=0;o<s.length;o++){for(;a<c.length&&s[o].claim_order>=c[a].claim_order;)a++;const d=a<c.length?c[a]:null;t.insertBefore(s[o],d)}}function ft(t,e){t.appendChild(e)}function dt(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function Ct(t){const e=tt("style");return Nt(dt(t),e),e.sheet}function Nt(t,e){ft(t.head||t,e)}function Mt(t,e){if(G){for(St(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentElement!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function Zt(t,e,n){G&&!n?Mt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function _t(t){t.parentNode.removeChild(t)}function te(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function tt(t){return document.createElement(t)}function jt(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function et(t){return document.createTextNode(t)}function ee(){return et(" ")}function ne(){return et("")}function rt(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function zt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function ie(t,e){for(const n in e)zt(t,n,e[n])}function Pt(t){return Array.from(t.childNodes)}function Rt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function ht(t,e,n,i,r=!1){Rt(t);const c=(()=>{for(let s=t.claim_info.last_index;s<t.length;s++){const l=t[s];if(e(l)){const o=n(l);return o===void 0?t.splice(s,1):t[s]=o,r||(t.claim_info.last_index=s),l}}for(let s=t.claim_info.last_index-1;s>=0;s--){const l=t[s];if(e(l)){const o=n(l);return o===void 0?t.splice(s,1):t[s]=o,r?o===void 0&&t.claim_info.last_index--:t.claim_info.last_index=s,l}}return i()})();return c.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,c}function mt(t,e,n,i){return ht(t,r=>r.nodeName===e,r=>{const c=[];for(let s=0;s<r.attributes.length;s++){const l=r.attributes[s];n[l.name]||c.push(l.name)}c.forEach(s=>r.removeAttribute(s))},()=>i(e))}function se(t,e,n){return mt(t,e,n,tt)}function re(t,e,n){return mt(t,e,n,jt)}function Dt(t,e){return ht(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>et(e),!0)}function oe(t){return Dt(t," ")}function ce(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function le(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}let O;function Ot(){if(O===void 0){O=!1;try{typeof window!="undefined"&&window.parent&&window.parent.document}catch{O=!0}}return O}function ae(t,e){getComputedStyle(t).position==="static"&&(t.style.position="relative");const i=tt("iframe");i.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),i.setAttribute("aria-hidden","true"),i.tabIndex=-1;const r=Ot();let c;return r?(i.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",c=rt(window,"message",s=>{s.source===i.contentWindow&&e()})):(i.src="about:blank",i.onload=()=>{c=rt(i.contentWindow,"resize",e)}),ft(t,i),()=>{(r||c&&i.contentWindow)&&c(),_t(i)}}function ue(t,e,n){t.classList[n?"add":"remove"](e)}function pt(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const r=document.createEvent("CustomEvent");return r.initCustomEvent(t,n,i,e),r}function fe(t,e=document.body){return Array.from(e.querySelectorAll(t))}const W=new Map;let B=0;function qt(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function Lt(t,e){const n={stylesheet:Ct(e),rules:{}};return W.set(t,n),n}function F(t,e,n,i,r,c,s,l=0){const o=16.666/i;let a=`{
`;for(let m=0;m<=1;m+=o){const g=e+(n-e)*c(m);a+=m*100+`%{${s(g,1-g)}}
`}const d=a+`100% {${s(n,1-n)}}
}`,f=`__svelte_${qt(d)}_${l}`,u=dt(t),{stylesheet:_,rules:h}=W.get(u)||Lt(u,t);h[f]||(h[f]=!0,_.insertRule(`@keyframes ${f} ${d}`,_.cssRules.length));const y=t.style.animation||"";return t.style.animation=`${y?`${y}, `:""}${f} ${i}ms linear ${r}ms 1 both`,B+=1,f}function I(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?c=>c.indexOf(e)<0:c=>c.indexOf("__svelte")===-1),r=n.length-i.length;r&&(t.style.animation=i.join(", "),B-=r,B||Tt())}function Tt(){Y(()=>{B||(W.forEach(t=>{const{stylesheet:e}=t;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.rules={}}),W.clear())})}let z;function j(t){z=t}function P(){if(!z)throw new Error("Function called outside component initialization");return z}function de(t){P().$$.on_mount.push(t)}function _e(t){P().$$.after_update.push(t)}function he(){const t=P();return(e,n,{cancelable:i=!1}={})=>{const r=t.$$.callbacks[e];if(r){const c=pt(e,n,{cancelable:i});return r.slice().forEach(s=>{s.call(t,c)}),!c.defaultPrevented}return!0}}function me(t,e){return P().$$.context.set(t,e),e}function pe(t){return P().$$.context.get(t)}const M=[],ot=[],L=[],Q=[],yt=Promise.resolve();let U=!1;function gt(){U||(U=!0,yt.then(bt))}function ye(){return gt(),yt}function C(t){L.push(t)}function ge(t){Q.push(t)}const K=new Set;let q=0;function bt(){const t=z;do{for(;q<M.length;){const e=M[q];q++,j(e),Wt(e.$$)}for(j(null),M.length=0,q=0;ot.length;)ot.pop()();for(let e=0;e<L.length;e+=1){const n=L[e];K.has(n)||(K.add(n),n())}L.length=0}while(M.length);for(;Q.length;)Q.pop()();U=!1,K.clear(),j(t)}function Wt(t){if(t.fragment!==null){t.update(),A(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(C)}}let N;function nt(){return N||(N=Promise.resolve(),N.then(()=>{N=null})),N}function k(t,e,n){t.dispatchEvent(pt(`${e?"intro":"outro"}${n}`))}const T=new Set;let v;function be(){v={r:0,c:[],p:v}}function we(){v.r||A(v.c),v=v.p}function wt(t,e){t&&t.i&&(T.delete(t),t.i(e))}function Bt(t,e,n,i){if(t&&t.o){if(T.has(t))return;T.add(t),v.c.push(()=>{T.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}}const it={duration:0};function xe(t,e,n){let i=e(t,n),r=!1,c,s,l=0;function o(){c&&I(t,c)}function a(){const{delay:f=0,duration:u=300,easing:_=V,tick:h=E,css:y}=i||it;y&&(c=F(t,0,1,u,f,_,y,l++)),h(0,1);const m=X()+f,g=m+u;s&&s.abort(),r=!0,C(()=>k(t,!0,"start")),s=Z(b=>{if(r){if(b>=g)return h(1,0),k(t,!0,"end"),o(),r=!1;if(b>=m){const w=_((b-m)/u);h(w,1-w)}}return r})}let d=!1;return{start(){d||(d=!0,I(t),H(i)?(i=i(),nt().then(a)):a())},invalidate(){d=!1},end(){r&&(o(),r=!1)}}}function $e(t,e,n){let i=e(t,n),r=!0,c;const s=v;s.r+=1;function l(){const{delay:o=0,duration:a=300,easing:d=V,tick:f=E,css:u}=i||it;u&&(c=F(t,1,0,a,o,d,u));const _=X()+o,h=_+a;C(()=>k(t,!1,"start")),Z(y=>{if(r){if(y>=h)return f(0,1),k(t,!1,"end"),--s.r||A(s.c),!1;if(y>=_){const m=d((y-_)/a);f(1-m,m)}}return r})}return H(i)?nt().then(()=>{i=i(),l()}):l(),{end(o){o&&i.tick&&i.tick(1,0),r&&(c&&I(t,c),r=!1)}}}function ve(t,e,n,i){let r=e(t,n),c=i?0:1,s=null,l=null,o=null;function a(){o&&I(t,o)}function d(u,_){const h=u.b-c;return _*=Math.abs(h),{a:c,b:u.b,d:h,duration:_,start:u.start,end:u.start+_,group:u.group}}function f(u){const{delay:_=0,duration:h=300,easing:y=V,tick:m=E,css:g}=r||it,b={start:X()+_,b:u};u||(b.group=v,v.r+=1),s||l?l=b:(g&&(a(),o=F(t,c,u,h,_,y,g)),u&&m(0,1),s=d(b,h),C(()=>k(t,u,"start")),Z(w=>{if(l&&w>l.start&&(s=d(l,h),l=null,k(t,s.b,"start"),g&&(a(),o=F(t,c,s.b,s.duration,0,y,r.css))),s){if(w>=s.end)m(c=s.b,1-c),k(t,s.b,"end"),l||(s.b?a():--s.group.r||A(s.group.c)),s=null;else if(w>=s.start){const R=w-s.start;c=s.a+s.d*y(R/s.duration),m(c,1-c)}}return!!(s||l)}))}return{run(u){H(r)?nt().then(()=>{r=r(),f(u)}):f(u)},end(){a(),s=l=null}}}function ke(t,e){Bt(t,1,1,()=>{e.delete(t.key)})}function Ee(t,e,n,i,r,c,s,l,o,a,d,f){let u=t.length,_=c.length,h=u;const y={};for(;h--;)y[t[h].key]=h;const m=[],g=new Map,b=new Map;for(h=_;h--;){const p=f(r,c,h),x=n(p);let $=s.get(x);$?i&&$.p(p,e):($=a(x,p),$.c()),g.set(x,m[h]=$),x in y&&b.set(x,Math.abs(h-y[x]))}const w=new Set,R=new Set;function J(p){wt(p,1),p.m(l,d),s.set(p.key,p),d=p.first,_--}for(;u&&_;){const p=m[_-1],x=t[u-1],$=p.key,D=x.key;p===x?(d=p.first,u--,_--):g.has(D)?!s.has($)||w.has($)?J(p):R.has(D)?u--:b.get($)>b.get(D)?(R.add($),J(p)):(w.add(D),u--):(o(x,s),u--)}for(;u--;){const p=t[u];g.has(p.key)||o(p,s)}for(;_;)J(m[_-1]);return m}function Ae(t,e){const n={},i={},r={$$scope:1};let c=t.length;for(;c--;){const s=t[c],l=e[c];if(l){for(const o in s)o in l||(i[o]=1);for(const o in l)r[o]||(n[o]=l[o],r[o]=1);t[c]=l}else for(const o in s)r[o]=1}for(const s in i)s in n||(n[s]=void 0);return n}function Se(t){return typeof t=="object"&&t!==null?t:{}}function Ce(t,e,n){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,n(t.$$.ctx[i]))}function Ne(t){t&&t.c()}function Me(t,e){t&&t.l(e)}function Ft(t,e,n,i){const{fragment:r,on_mount:c,on_destroy:s,after_update:l}=t.$$;r&&r.m(e,n),i||C(()=>{const o=c.map(ct).filter(H);s?s.push(...o):A(o),t.$$.on_mount=[]}),l.forEach(C)}function It(t,e){const n=t.$$;n.fragment!==null&&(A(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Ht(t,e){t.$$.dirty[0]===-1&&(M.push(t),gt(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function je(t,e,n,i,r,c,s,l=[-1]){const o=z;j(t);const a=t.$$={fragment:null,ctx:null,props:c,update:E,not_equal:r,bound:st(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(o?o.$$.context:[])),callbacks:st(),dirty:l,skip_bound:!1,root:e.target||o.$$.root};s&&s(a.root);let d=!1;if(a.ctx=n?n(t,e.props||{},(f,u,..._)=>{const h=_.length?_[0]:u;return a.ctx&&r(a.ctx[f],a.ctx[f]=h)&&(!a.skip_bound&&a.bound[f]&&a.bound[f](h),d&&Ht(t,f)),u}):[],a.update(),d=!0,A(a.before_update),a.fragment=i?i(a.ctx):!1,e.target){if(e.hydrate){kt();const f=Pt(e.target);a.fragment&&a.fragment.l(f),f.forEach(_t)}else a.fragment&&a.fragment.c();e.intro&&wt(t.$$.fragment),Ft(t,e.target,e.anchor,e.customElement),Et(),bt()}j(o)}class ze{$destroy(){It(this,1),this.$destroy=E}$on(e,n){const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(e){this.$$set&&!$t(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{X as $,Se as A,It as B,xt as C,ye as D,E,vt as F,A as G,H,Kt as I,Ut as J,Vt as K,Qt as L,Mt as M,V as N,ue as O,pe as P,Jt as Q,C as R,ze as S,ae as T,ot as U,jt as V,re as W,ie as X,rt as Y,te as Z,he as _,Pt as a,Z as a0,Yt as a1,ve as a2,xe as a3,$e as a4,Ee as a5,ke as a6,Xt as a7,Ce as a8,ge as a9,fe as aa,zt as b,se as c,_t as d,tt as e,le as f,Zt as g,Dt as h,je as i,ce as j,ee as k,ne as l,oe as m,be as n,Bt as o,we as p,wt as q,me as r,Gt as s,et as t,_e as u,de as v,Ne as w,Me as x,Ft as y,Ae as z};
