(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(o){if(o.ep)return;o.ep=!0;const i=t(o);fetch(o.href,i)}})();class E{constructor(){this.initializeAIService(),this.init(),this.initializeSettings(),this.loadSettings(),this.loadProjects()}initializeAIService(){const e=localStorage.getItem("apiKey"),t=localStorage.getItem("apiType")||"azure",n=localStorage.getItem("azureResourceName"),o=localStorage.getItem("azureDeploymentName");this.aiService=new AIService(e,{apiType:t,azureResourceName:n,azureDeploymentName:o})}initializeSettings(){this.settingsBtn=document.getElementById("settingsBtn"),this.settingsModal=document.getElementById("settingsModal"),this.closeSettingsBtn=document.getElementById("closeSettings"),this.saveSettingsBtn=document.getElementById("saveSettings"),this.apiTypeSelect=document.getElementById("apiType"),this.azureSettings=document.getElementById("azureSettings"),this.settingsBtn&&(this.settingsBtn.onclick=e=>{e.preventDefault(),e.stopPropagation(),this.openSettings()}),this.closeSettingsBtn&&(this.closeSettingsBtn.onclick=()=>{this.settingsModal.style.display="none"}),this.saveSettingsBtn&&(this.saveSettingsBtn.onclick=async()=>{await this.saveSettings()}),this.apiTypeSelect&&(this.apiTypeSelect.onchange=()=>{this.toggleAzureSettings()}),this.settingsModal&&(this.settingsModal.onclick=e=>{e.target===this.settingsModal&&(this.settingsModal.style.display="none")})}openSettings(){if(console.log("打开设置"),!this.settingsModal)return;const e=document.getElementById("apiType"),t=document.getElementById("apiKey"),n=document.getElementById("azureResourceName"),o=document.getElementById("azureDeploymentName"),i=document.getElementById("promptTemplate");e&&(e.value=localStorage.getItem("apiType")||"azure"),t&&(t.value=localStorage.getItem("apiKey")||""),n&&(n.value=localStorage.getItem("azureResourceName")||""),o&&(o.value=localStorage.getItem("azureDeploymentName")||""),i&&(i.value=localStorage.getItem("promptTemplate")||""),this.toggleAzureSettings(),this.settingsModal.style.display="block"}async saveSettings(){try{const e=document.getElementById("apiType").value,t=document.getElementById("apiKey").value,n=document.getElementById("azureResourceName").value,o=document.getElementById("azureDeploymentName").value,i=document.getElementById("promptTemplate").value;if(!t)throw new Error("请输入 API 密钥");if(e==="azure"){if(!n)throw new Error("请输入 Azure 资源名称");if(!o)throw new Error("请输入部署名称")}localStorage.setItem("apiType",e),localStorage.setItem("apiKey",t),localStorage.setItem("azureResourceName",n),localStorage.setItem("azureDeploymentName",o),localStorage.setItem("promptTemplate",i),await this.loadSettings(),this.showSuccess("设置已保存"),this.settingsModal.style.display="none"}catch(e){this.showError(e.message)}}toggleAzureSettings(){const e=document.getElementById("apiType").value,t=document.getElementById("azureSettings");t&&(t.style.display=e==="azure"?"block":"none")}showSuccess(e){alert(e)}showError(e){alert(e)}init(){console.log("Initializing..."),document.body.addEventListener("click",()=>{console.log("Body clicked")}),this.projectList=document.getElementById("projectList"),this.projectListContainer=document.getElementById("projectListContainer"),this.newProjectBtn=document.getElementById("newProjectBtn"),this.projectCreation=document.getElementById("projectCreation"),this.projectNameInput=document.getElementById("projectName"),this.projectDescInput=document.getElementById("projectDesc"),this.createProjectBtn=document.getElementById("createProject"),this.cancelCreateBtn=document.getElementById("cancelCreate"),this.prototypeGenerator=document.getElementById("prototypeGenerator"),this.currentProjectName=document.getElementById("currentProjectName"),this.backToProjectsBtn=document.getElementById("backToProjects"),this.requirementsInput=document.getElementById("requirements"),this.generateBtn=document.getElementById("generate"),this.chatHistoryDiv=document.getElementById("chatHistory"),this.previewArea=document.getElementById("preview");const e=document.createElement("button");e.id="downloadBtn",e.className="download-btn",e.style.display="none",e.innerHTML=`
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 12l-4-4h2.5V3h3v5H12L8 12z"/>
                <path d="M13 13H3v-2h10v2z"/>
            </svg>
            下载HTML
        `,document.body.appendChild(e);const t=document.createElement("style");if(t.textContent=`
            .download-btn {
                position: fixed;
                top: 20px;
                right: 80px; /* 调整位置，避免与设置按钮重叠 */
                padding: 8px 16px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 14px;
                z-index: 1000;
                transition: background-color 0.2s;
            }

            .download-btn:hover {
                background: #0056b3;
            }

            .download-btn svg {
                width: 16px;
                height: 16px;
            }

            .download-btn.disabled {
                background: #ccc;
                cursor: not-allowed;
            }
        `,document.head.appendChild(t),!this.projectList||!this.projectCreation||!this.prototypeGenerator){console.error("找不到必要的页面元素");return}this.bindEvents(),this.showProjectList();const n=document.createElement("div");n.className="resizer",document.querySelector(".container").appendChild(n),this.initResizer()}bindEvents(){this.newProjectBtn&&this.newProjectBtn.addEventListener("click",()=>{console.log("点击新建项目按钮"),this.showProjectCreation()}),this.createProjectBtn&&this.createProjectBtn.addEventListener("click",()=>{console.log("点击创建项目按钮"),this.handleCreateProject()}),this.cancelCreateBtn&&this.cancelCreateBtn.addEventListener("click",()=>{console.log("点击取消按钮"),this.showProjectList()}),this.backToProjectsBtn&&this.backToProjectsBtn.addEventListener("click",()=>{console.log("点击返回按钮"),this.showProjectList()}),this.generateBtn&&this.generateBtn.addEventListener("click",()=>{console.log("点击生成按钮"),this.handleNewMessage()});const e=document.getElementById("settingsBtn"),t=document.getElementById("settingsModal"),n=document.getElementById("closeSettings"),o=document.getElementById("saveSettings");e&&e.addEventListener("click",()=>{console.log("点击设置按钮"),this.loadCurrentSettings(),t.style.display="block"}),n&&n.addEventListener("click",()=>{t.style.display="none"}),o&&o.addEventListener("click",()=>{this.saveCurrentSettings()}),t&&t.addEventListener("click",r=>{r.target===t&&(t.style.display="none")});const i=document.getElementById("downloadBtn");if(i&&i.addEventListener("click",()=>{this.downloadHTML()}),this.requirementsInput){this.requirementsInput.addEventListener("keydown",l=>{if(l.key==="Enter"&&(l.metaKey||l.ctrlKey)){l.preventDefault(),this.generateBtn.disabled||this.handleNewMessage();return}});const s=/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"⌘ + Enter 发送":"Ctrl + Enter 发送",a=this.requirementsInput.parentElement;a&&a.classList.contains("chat-input")&&a.setAttribute("data-shortcut",s)}}loadProjects(){this.projects=JSON.parse(localStorage.getItem("projects")||"[]"),this.renderProjectList()}saveProjects(){localStorage.setItem("projects",JSON.stringify(this.projects))}renderProjectList(){if(this.projectListContainer.innerHTML="",this.projects.length===0){this.projectListContainer.innerHTML=`
                <div class="no-projects">
                    <p>还没有项目，立即创建一个吧！</p>
                </div>
            `;return}this.projects.forEach(e=>{const t=document.createElement("div");t.className="project-card",t.onclick=()=>this.openProject(e);const o=new Date(e.created).toLocaleDateString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"});t.innerHTML=`
                <h3>${e.name}</h3>
                ${e.description?`<div class="project-desc">${e.description}</div>`:""}
                <div class="project-meta">
                    创建时间：${o}
                </div>
            `,this.projectListContainer.appendChild(t)})}showProjectList(){console.log("显示项目列表"),this.projectList.style.display="block",this.projectCreation.style.display="none",this.prototypeGenerator.style.display="none";const e=document.getElementById("downloadBtn");e&&(e.style.display="none"),this.renderProjectList()}showProjectCreation(){console.log("显示项目创建页面"),this.projectList.style.display="none",this.projectCreation.style.display="flex",this.prototypeGenerator.style.display="none";const e=document.getElementById("downloadBtn");e&&(e.style.display="none"),this.projectNameInput.value="",this.projectDescInput.value=""}showPrototypeGenerator(){console.log("显示原型生成器页面"),this.projectList.style.display="none",this.projectCreation.style.display="none",this.prototypeGenerator.style.display="flex";const e=document.getElementById("downloadBtn");e&&(e.style.display="flex")}handleCreateProject(){console.log("处理项目创建");const e=this.projectNameInput.value.trim();if(!e){this.showError("请输入项目名称");return}const t={id:Date.now().toString(),name:e,description:this.projectDescInput.value.trim(),created:new Date().toISOString(),chatHistory:[]};this.projects||(this.projects=[]),this.projects.push(t),this.saveProjects(),this.openProject(t)}openProject(e){this.currentProject=e,this.currentProjectName.textContent=e.name,this.chatHistory=e.chatHistory||[],this.chatHistoryDiv.innerHTML="",this.chatHistory.forEach(t=>{this.addMessageToHistory(t.type,t.content,!1)}),this.showPrototypeGenerator()}async handleNewMessage(){const e=this.requirementsInput.value.trim();if(!e){this.showError("请输入需求描述");return}if(!this.aiService){this.showError("请先在设置中配置 API 参数");return}try{this.generateBtn.disabled=!0,this.loadingIndicator&&!this.previewArea.contains(this.loadingIndicator)&&this.previewArea.appendChild(this.loadingIndicator.cloneNode(!0));const t=document.createElement("div");t.className="chat-message user-message",t.textContent=e,this.chatHistoryDiv.appendChild(t);const n=await this.aiService.generateCode(e,this.getContextPrompt()),o=document.createElement("div");o.className="chat-message ai-message",o.innerHTML=`
                <div class="code-section">
                    <h4>HTML代码</h4>
                    <pre><code class="language-html">${this.escapeHtml(n.html||"")}</code></pre>
                </div>
                <div class="code-section">
                    <h4>JavaScript代码</h4>
                    <pre><code class="language-javascript">${this.escapeHtml(n.javascript||"")}</code></pre>
                </div>
                <div class="description-section">
                    <p>${this.escapeHtml(n.description||"")}</p>
                </div>
            `,this.chatHistoryDiv.appendChild(o),this.renderPreview(n),this.currentProject&&(this.chatHistory||(this.chatHistory=[]),this.chatHistory.push({type:"user",content:e},{type:"ai",content:n}),this.currentProject.chatHistory=this.chatHistory,this.saveProjects()),this.requirementsInput.value="",this.chatHistoryDiv.scrollTop=this.chatHistoryDiv.scrollHeight}catch(t){console.error("生成代码时出错:",t),this.showError(t.message)}finally{this.generateBtn.disabled=!1;const t=this.previewArea.querySelector(".loading-indicator");t&&this.previewArea.removeChild(t)}}addMessageToHistory(e,t,n=!0){try{const o=document.createElement("div");o.className=`chat-message ${e}-message`,e==="user"?o.textContent=t:o.innerHTML=`
                    <div class="code-section">
                        <h4>HTML代码</h4>
                        <pre><code class="language-html">${this.escapeHtml(t.html||"")}</code></pre>
                    </div>
                    <div class="code-section">
                        <h4>JavaScript代码</h4>
                        <pre><code class="language-javascript">${this.escapeHtml(t.javascript||"")}</code></pre>
                    </div>
                    <div class="description-section">
                        <p>${this.escapeHtml(t.description||"")}</p>
                    </div>
                `,this.chatHistoryDiv.appendChild(o),this.chatHistoryDiv.scrollTop=this.chatHistoryDiv.scrollHeight,n&&this.currentProject&&(this.chatHistory||(this.chatHistory=[]),this.chatHistory.push({type:e,content:t,timestamp:new Date().toISOString()}),this.currentProject.chatHistory=this.chatHistory,this.saveProjects())}catch(o){console.error("添加消息到历史记录时出错:",o),this.showError("添加消息失败: "+o.message)}}getContextPrompt(){let e=`当前项目：${this.currentProject.name}
`;return this.currentProject.description&&(e+=`项目描述：${this.currentProject.description}
`),e+=`之前的对话历史
`,this.chatHistory.forEach(t=>{t.type==="user"?e+=`用户：${t.content}
`:e+=`AI：[生成了代码]
`}),e}showLoading(){this.generateBtn.disabled=!0,this.loadingIndicator&&!this.previewArea.contains(this.loadingIndicator)&&this.previewArea.appendChild(this.loadingIndicator)}hideLoading(){this.generateBtn.disabled=!1,this.loadingIndicator&&this.loadingIndicator.parentNode===this.previewArea&&this.previewArea.removeChild(this.loadingIndicator)}escapeHtml(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}loadSettings(){localStorage.getItem("apiKey");const e=localStorage.getItem("promptTemplate")||"请根据以下需求生成前界面：";this.initializeAIService(),this.promptTemplate=e}renderPreview(e){this.previewArea.innerHTML="";const t=document.createElement("iframe");t.style.cssText=`
            width: 100%;
            height: 100%;
            border: none;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        `,this.previewArea.appendChild(t);const n=`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: 100vh;
                        overflow: auto;
                    }
                    * {
                        box-sizing: border-box;
                    }
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .error-message {
                        color: red;
                        padding: 10px;
                        margin: 10px 0;
                        background: rgba(255,0,0,0.1);
                        border-radius: 4px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    ${e.html}
                </div>
                <script>
                    try {
                        // Canvas 相关的辅助函数
                        function initCanvas(canvas) {
                            if (!canvas) return null;
                            try {
                                const ctx = canvas.getContext('2d');
                                if (!ctx) {
                                    console.error('Canvas context not supported');
                                    return null;
                                }
                                return ctx;
                            } catch (e) {
                                console.error('Canvas error:', e);
                                return null;
                            }
                        }

                        // 重写 getElementById 以添加 Canvas 支持
                        const originalGetElementById = document.getElementById;
                        document.getElementById = function(id) {
                            const element = originalGetElementById.call(document, id);
                            if (element && element.tagName === 'CANVAS') {
                                // 为 Canvas 元素添加 getContext 方法的包装
                                const originalGetContext = element.getContext;
                                element.getContext = function(contextType) {
                                    try {
                                        if (!originalGetContext) {
                                            console.error('Canvas not supported');
                                            return null;
                                        }
                                        return originalGetContext.call(element, contextType);
                                    } catch (e) {
                                        console.error('Canvas context error:', e);
                                        return null;
                                    }
                                };
                            }
                            return element;
                        };

                        // 添加错误处理函数
                        window.onerror = function(msg, url, line, col, error) {
                            console.error('JavaScript错误:', msg, 'at line:', line);
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'error-message';
                            errorDiv.textContent = \`错误: \${msg} (行 \${line})\`;
                            document.body.insertBefore(errorDiv, document.body.firstChild);
                            return false;
                        };

                        // 初始化所有已存在的 Canvas 元素
                        document.querySelectorAll('canvas').forEach(canvas => {
                            const ctx = initCanvas(canvas);
                            if (!ctx) {
                                const errorDiv = document.createElement('div');
                                errorDiv.className = 'error-message';
                                errorDiv.textContent = '无法初始化 Canvas 上下文';
                                canvas.parentNode.insertBefore(errorDiv, canvas);
                            }
                        });

                        // 执行生成的代码
                        ${e.javascript}
                    } catch (error) {
                        console.error('JavaScript执行错误:', error);
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'error-message';
                        errorDiv.textContent = \`执行错误: \${error.message}\`;
                        document.body.insertBefore(errorDiv, document.body.firstChild);
                    }
                <\/script>
            </body>
            </html>
        `,o=t.contentWindow.document;o.open(),o.write(n),o.close(),t.contentWindow.onerror=(i,r,s)=>{console.error("预览页面错误:",i,"at line:",s);const a=document.createElement("div");return a.className="error-message",a.textContent=`错误: ${i} (行 ${s})`,t.contentWindow.document.body.insertBefore(a,t.contentWindow.document.body.firstChild),!1}}loadCurrentSettings(){const e=document.getElementById("apiType"),t=document.getElementById("apiKey"),n=document.getElementById("azureResourceName"),o=document.getElementById("azureDeploymentName"),i=document.getElementById("promptTemplate");e&&(e.value=localStorage.getItem("apiType")||"azure"),t&&(t.value=localStorage.getItem("apiKey")||""),n&&(n.value=localStorage.getItem("azureResourceName")||""),o&&(o.value=localStorage.getItem("azureDeploymentName")||""),i&&(i.value=localStorage.getItem("promptTemplate")||""),this.toggleAzureSettings()}async saveCurrentSettings(){try{const e=document.getElementById("apiType").value,t=document.getElementById("apiKey").value,n=document.getElementById("azureResourceName").value,o=document.getElementById("azureDeploymentName").value,i=document.getElementById("promptTemplate").value;if(!t)throw new Error("请输入 API 密钥");if(e==="azure"){if(!n)throw new Error("请输入 Azure 资源名称");if(!o)throw new Error("请输入部署名称")}localStorage.setItem("apiType",e),localStorage.setItem("apiKey",t),localStorage.setItem("azureResourceName",n),localStorage.setItem("azureDeploymentName",o),localStorage.setItem("promptTemplate",i),this.initializeAIService(),alert("设置已保存"),document.getElementById("settingsModal").style.display="none"}catch(e){alert(e.message)}}downloadHTML(){if(!this.currentProject||!this.chatHistory||this.chatHistory.length===0){this.showError("没有可下载的内容");return}const e=this.chatHistory.filter(a=>a.type==="ai").pop();if(!e){this.showError("没有找到生成的代码");return}const{html:t,javascript:n}=e.content,o=`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.currentProject.name} - 原型</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100vh;
            overflow: auto;
        }
        * {
            box-sizing: border-box;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        ${t}
    </div>
    <script>
        ${n}
    <\/script>
</body>
</html>`,i=new Blob([o],{type:"text/html"}),r=URL.createObjectURL(i),s=document.createElement("a");s.href=r,s.download=`${this.currentProject.name}-prototype.html`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(r)}initResizer(){const e=document.querySelector(".container"),t=document.querySelector(".left-panel"),n=document.querySelector(".right-panel"),o=document.querySelector(".resizer");let i=!1,r,s,a;o.addEventListener("mousedown",c=>{i=!0,r=c.pageX;const d=t.getBoundingClientRect(),m=n.getBoundingClientRect();s=d.width,a=m.width,document.addEventListener("mousemove",l),document.addEventListener("mouseup",y),document.body.classList.add("resizing")});function l(c){if(!i)return;const d=c.pageX-r,m=e.offsetWidth;let h=(s+d)/m*100,u=(a-d)/m*100;const p=300/m*100;h<p?(h=p,u=100-p):u<p&&(u=p,h=100-p),t.style.flex=`0 0 ${h}%`,n.style.flex=`0 0 ${u}%`;const I=document.querySelector(".chat-input");I&&(I.style.width="100%")}function y(){i=!1,document.removeEventListener("mousemove",l),document.removeEventListener("mouseup",y),document.body.classList.remove("resizing")}o.addEventListener("touchstart",c=>{const d=c.touches[0];i=!0,r=d.pageX;const m=t.getBoundingClientRect(),h=n.getBoundingClientRect();s=m.width,a=h.width,document.addEventListener("touchmove",v),document.addEventListener("touchend",f),document.body.classList.add("resizing")});function v(c){if(!i)return;c.preventDefault(),c.touches[0].pageX-r}function f(){i=!1,document.removeEventListener("touchmove",v),document.removeEventListener("touchend",f),document.body.classList.remove("resizing")}}}window.addEventListener("DOMContentLoaded",()=>{try{console.log("Initializing PrototypeGenerator..."),window.app=new E,console.log("PrototypeGenerator initialized successfully")}catch(g){console.error("Failed to initialize PrototypeGenerator:",g)}});
