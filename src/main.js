class PrototypeGenerator {
    constructor() {
        this.initializeAIService();
        this.init();
        this.initializeSettings();
        this.loadSettings();
        this.loadProjects();
    }

    initializeAIService() {
        const apiKey = localStorage.getItem('apiKey');
        const apiType = localStorage.getItem('apiType') || 'azure';
        const azureResourceName = localStorage.getItem('azureResourceName');
        const azureDeploymentName = localStorage.getItem('azureDeploymentName');

        this.aiService = new AIService(apiKey, {
            apiType,
            azureResourceName,
            azureDeploymentName
        });
    }

    initializeSettings() {
        // 获取设置相关的元素
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettingsBtn = document.getElementById('closeSettings');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        this.apiTypeSelect = document.getElementById('apiType');
        this.azureSettings = document.getElementById('azureSettings');

        // 绑定设置按钮点击事件
        if (this.settingsBtn) {
            this.settingsBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openSettings();
            };
        }

        // 绑定关闭按钮事件
        if (this.closeSettingsBtn) {
            this.closeSettingsBtn.onclick = () => {
                this.settingsModal.style.display = 'none';
            };
        }

        // 绑定保存按钮事件
        if (this.saveSettingsBtn) {
            this.saveSettingsBtn.onclick = async () => {
                await this.saveSettings();
            };
        }

        // 绑定 API 类型切换事件
        if (this.apiTypeSelect) {
            this.apiTypeSelect.onchange = () => {
                this.toggleAzureSettings();
            };
        }

        // 点击模态框外部关闭
        if (this.settingsModal) {
            this.settingsModal.onclick = (e) => {
                if (e.target === this.settingsModal) {
                    this.settingsModal.style.display = 'none';
                }
            };
        }
    }

    openSettings() {
        console.log('打开设置');
        if (!this.settingsModal) return;

        // 加载当前设置
        const apiType = document.getElementById('apiType');
        const apiKeyInput = document.getElementById('apiKey');
        const azureResourceName = document.getElementById('azureResourceName');
        const azureDeploymentName = document.getElementById('azureDeploymentName');
        const promptTemplateInput = document.getElementById('promptTemplate');

        if (apiType) apiType.value = localStorage.getItem('apiType') || 'azure';
        if (apiKeyInput) apiKeyInput.value = localStorage.getItem('apiKey') || '';
        if (azureResourceName) azureResourceName.value = localStorage.getItem('azureResourceName') || '';
        if (azureDeploymentName) azureDeploymentName.value = localStorage.getItem('azureDeploymentName') || '';
        if (promptTemplateInput) promptTemplateInput.value = localStorage.getItem('promptTemplate') || '';

        this.toggleAzureSettings();
        this.settingsModal.style.display = 'block';
    }

    async saveSettings() {
        try {
            const apiType = document.getElementById('apiType').value;
            const apiKey = document.getElementById('apiKey').value;
            const azureResourceName = document.getElementById('azureResourceName').value;
            const azureDeploymentName = document.getElementById('azureDeploymentName').value;
            const promptTemplate = document.getElementById('promptTemplate').value;

            // 验证必填字段
            if (!apiKey) {
                throw new Error('请输入 API 密钥');
            }

            if (apiType === 'azure') {
                if (!azureResourceName) throw new Error('请输入 Azure 资源名称');
                if (!azureDeploymentName) throw new Error('请输入部署名称');
            }

            // 保存设置
            localStorage.setItem('apiType', apiType);
            localStorage.setItem('apiKey', apiKey);
            localStorage.setItem('azureResourceName', azureResourceName);
            localStorage.setItem('azureDeploymentName', azureDeploymentName);
            localStorage.setItem('promptTemplate', promptTemplate);

            // 重新初始化 AI 服务
            await this.loadSettings();

            this.showSuccess('设置已保存');
            this.settingsModal.style.display = 'none';
        } catch (error) {
            this.showError(error.message);
        }
    }

    toggleAzureSettings() {
        const apiType = document.getElementById('apiType').value;
        const azureSettings = document.getElementById('azureSettings');
        if (azureSettings) {
            azureSettings.style.display = apiType === 'azure' ? 'block' : 'none';
        }
    }

    showSuccess(message) {
        alert(message); // 可��改为更友好的提示
    }

    showError(message) {
        alert(message); // 可以改为更友好的提示
    }

    init() {
        // 项目列表页面元素
        this.projectList = document.getElementById('projectList');
        this.projectListContainer = document.getElementById('projectListContainer');
        this.newProjectBtn = document.getElementById('newProjectBtn');

        // 项目创建页面元素
        this.projectCreation = document.getElementById('projectCreation');
        this.projectNameInput = document.getElementById('projectName');
        this.projectDescInput = document.getElementById('projectDesc');
        this.createProjectBtn = document.getElementById('createProject');
        this.cancelCreateBtn = document.getElementById('cancelCreate');

        // 原型生成页面元素
        this.prototypeGenerator = document.getElementById('prototypeGenerator');
        this.currentProjectName = document.getElementById('currentProjectName');
        this.backToProjectsBtn = document.getElementById('backToProjects');
        this.requirementsInput = document.getElementById('requirements');
        this.generateBtn = document.getElementById('generate');
        this.chatHistoryDiv = document.getElementById('chatHistory');
        this.previewArea = document.getElementById('preview');

        // 添加下载按钮到原型生成页面
        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'downloadBtn';
        downloadBtn.className = 'download-btn';
        downloadBtn.style.display = 'none'; // 初始隐藏
        downloadBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 12l-4-4h2.5V3h3v5H12L8 12z"/>
                <path d="M13 13H3v-2h10v2z"/>
            </svg>
            下载HTML
        `;
        document.body.appendChild(downloadBtn);

        // 添加下载按钮样式
        const style = document.createElement('style');
        style.textContent = `
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
        `;
        document.head.appendChild(style);

        // 确保所有元素都存在
        if (!this.projectList || !this.projectCreation || !this.prototypeGenerator) {
            console.error('找不到必要的页面元素');
            return;
        }

        // 绑定事件处理器
        this.bindEvents();

        // 初始显示项目列表
        this.showProjectList();

        // 添加分隔线
        const resizer = document.createElement('div');
        resizer.className = 'resizer';
        document.querySelector('.container').appendChild(resizer);

        // 初始化拖拽功能
        this.initResizer();
    }

    bindEvents() {
        // 使用箭头函数确保正确的 this 绑定
        if (this.newProjectBtn) {
            this.newProjectBtn.addEventListener('click', () => {
                console.log('点击新建项目按钮');
                this.showProjectCreation();
            });
        }

        if (this.createProjectBtn) {
            this.createProjectBtn.addEventListener('click', () => {
                console.log('点击创建项目按钮');
                this.handleCreateProject();
            });
        }

        if (this.cancelCreateBtn) {
            this.cancelCreateBtn.addEventListener('click', () => {
                console.log('点击取消按钮');
                this.showProjectList();
            });
        }

        if (this.backToProjectsBtn) {
            this.backToProjectsBtn.addEventListener('click', () => {
                console.log('点击返回按钮');
                this.showProjectList();
            });
        }

        if (this.generateBtn) {
            this.generateBtn.addEventListener('click', () => {
                console.log('点击生成按钮');
                this.handleNewMessage();
            });
        }

        // 添加设置按钮相关的事件绑定
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        const closeSettingsBtn = document.getElementById('closeSettings');
        const saveSettingsBtn = document.getElementById('saveSettings');

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                console.log('点击设置按钮');
                // 打开设置模态框前加载当前设置
                this.loadCurrentSettings();
                settingsModal.style.display = 'block';
            });
        }

        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', () => {
                settingsModal.style.display = 'none';
            });
        }

        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.saveCurrentSettings();
            });
        }

        // 点击模态框外部关闭
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) {
                    settingsModal.style.display = 'none';
                }
            });
        }

        // 添加下载按钮事件
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadHTML();
            });
        }

        // 添加输入框的事件监听
        if (this.requirementsInput) {
            this.requirementsInput.addEventListener('keydown', (e) => {
                // 检测 Command+Enter (Mac) 或 Ctrl+Enter (Windows)
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault(); // 阻止默认换行
                    if (!this.generateBtn.disabled) { // 确保按钮未被禁用
                        this.handleNewMessage();
                    }
                    return;
                }
            });

            // 添加快捷键提示
            const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
            const hintText = isMac ? '⌘ + Enter 发送' : 'Ctrl + Enter 发送';

            // 修改输入框的样式容器
            const chatInput = this.requirementsInput.parentElement;
            if (chatInput && chatInput.classList.contains('chat-input')) {
                chatInput.setAttribute('data-shortcut', hintText);
            }
        }
    }

    loadProjects() {
        // 从 localStorage 加载项目列表
        this.projects = JSON.parse(localStorage.getItem('projects') || '[]');
        this.renderProjectList();
    }

    saveProjects() {
        // 保存项目列表到 localStorage
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }

    renderProjectList() {
        this.projectListContainer.innerHTML = '';
        
        if (this.projects.length === 0) {
            this.projectListContainer.innerHTML = `
                <div class="no-projects">
                    <p>还没有项目，立即创建一个吧！</p>
                </div>
            `;
            return;
        }

        this.projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.onclick = () => this.openProject(project);

            const date = new Date(project.created);
            const formattedDate = date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            card.innerHTML = `
                <h3>${project.name}</h3>
                ${project.description ? `<div class="project-desc">${project.description}</div>` : ''}
                <div class="project-meta">
                    创建时间：${formattedDate}
                </div>
            `;

            this.projectListContainer.appendChild(card);
        });
    }

    showProjectList() {
        console.log('显示项目列表');
        this.projectList.style.display = 'block';
        this.projectCreation.style.display = 'none';
        this.prototypeGenerator.style.display = 'none';
        
        // 隐藏下载按钮
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.style.display = 'none';
        }
        this.renderProjectList();
    }

    showProjectCreation() {
        console.log('显示项目创建页面');
        this.projectList.style.display = 'none';
        this.projectCreation.style.display = 'flex';
        this.prototypeGenerator.style.display = 'none';
        
        // 隐藏下载按钮
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.style.display = 'none';
        }
        
        // 清空输入框
        this.projectNameInput.value = '';
        this.projectDescInput.value = '';
    }

    showPrototypeGenerator() {
        console.log('显示原型生成器页面');
        this.projectList.style.display = 'none';
        this.projectCreation.style.display = 'none';
        this.prototypeGenerator.style.display = 'flex';
        
        // ��示下载按钮
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.style.display = 'flex';
        }
    }

    handleCreateProject() {
        console.log('处理项目创建');
        const projectName = this.projectNameInput.value.trim();
        if (!projectName) {
            this.showError('请输入项目名称');
            return;
        }

        const newProject = {
            id: Date.now().toString(),
            name: projectName,
            description: this.projectDescInput.value.trim(),
            created: new Date().toISOString(),
            chatHistory: []
        };

        // 初始化 projects 数组（如果不存在）
        if (!this.projects) {
            this.projects = [];
        }

        this.projects.push(newProject);
        this.saveProjects();
        this.openProject(newProject);
    }

    openProject(project) {
        this.currentProject = project;
        this.currentProjectName.textContent = project.name;
        this.chatHistory = project.chatHistory || [];
        
        // 恢复聊天历史
        this.chatHistoryDiv.innerHTML = '';
        this.chatHistory.forEach(msg => {
            this.addMessageToHistory(msg.type, msg.content, false);
        });

        this.showPrototypeGenerator();
    }

    async handleNewMessage() {
        const message = this.requirementsInput.value.trim();
        if (!message) {
            this.showError('请输入需求描述');
            return;
        }

        // 检查 AI 服务是否已初始化
        if (!this.aiService) {
            this.showError('请先在设置中配置 API 参数');
            return;
        }

        try {
            // 显示加载状态
            this.generateBtn.disabled = true;
            if (this.loadingIndicator && !this.previewArea.contains(this.loadingIndicator)) {
                this.previewArea.appendChild(this.loadingIndicator.cloneNode(true));
            }

            // 添加用户消息到历史记录
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'chat-message user-message';
            userMessageDiv.textContent = message;
            this.chatHistoryDiv.appendChild(userMessageDiv);

            // 调用 AI 服务
            const response = await this.aiService.generateCode(message, this.getContextPrompt());

            // 添加 AI 响应到历史记录
            const aiMessageDiv = document.createElement('div');
            aiMessageDiv.className = 'chat-message ai-message';
            aiMessageDiv.innerHTML = `
                <div class="code-section">
                    <h4>HTML代码</h4>
                    <pre><code class="language-html">${this.escapeHtml(response.html || '')}</code></pre>
                </div>
                <div class="code-section">
                    <h4>JavaScript代码</h4>
                    <pre><code class="language-javascript">${this.escapeHtml(response.javascript || '')}</code></pre>
                </div>
                <div class="description-section">
                    <p>${this.escapeHtml(response.description || '')}</p>
                </div>
            `;
            this.chatHistoryDiv.appendChild(aiMessageDiv);

            // 更新预览
            this.renderPreview(response);

            // 保存到聊天历史
            if (this.currentProject) {
                if (!this.chatHistory) {
                    this.chatHistory = [];
                }
                this.chatHistory.push(
                    { type: 'user', content: message },
                    { type: 'ai', content: response }
                );
                this.currentProject.chatHistory = this.chatHistory;
                this.saveProjects();
            }

            // 清空输入框
            this.requirementsInput.value = '';
            
            // 滚动到底部
            this.chatHistoryDiv.scrollTop = this.chatHistoryDiv.scrollHeight;

        } catch (error) {
            console.error('生成代码时出错:', error);
            this.showError(error.message);
        } finally {
            // 移除加载状态
            this.generateBtn.disabled = false;
            const loadingIndicator = this.previewArea.querySelector('.loading-indicator');
            if (loadingIndicator) {
                this.previewArea.removeChild(loadingIndicator);
            }
        }
    }

    addMessageToHistory(type, content, save = true) {
        try {
            // 创建消息容器
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${type}-message`;
            
            if (type === 'user') {
                // 用户消息直接显示文本
                messageDiv.textContent = content;
            } else {
                // AI 消息需要处理代码描述
                messageDiv.innerHTML = `
                    <div class="code-section">
                        <h4>HTML代码</h4>
                        <pre><code class="language-html">${this.escapeHtml(content.html || '')}</code></pre>
                    </div>
                    <div class="code-section">
                        <h4>JavaScript代码</h4>
                        <pre><code class="language-javascript">${this.escapeHtml(content.javascript || '')}</code></pre>
                    </div>
                    <div class="description-section">
                        <p>${this.escapeHtml(content.description || '')}</p>
                    </div>
                `;
            }

            // 添加消息到聊天历史
            this.chatHistoryDiv.appendChild(messageDiv);
            
            // 滚动到底部
            this.chatHistoryDiv.scrollTop = this.chatHistoryDiv.scrollHeight;

            if (save && this.currentProject) {
                // 保存到项目历史记录
                if (!this.chatHistory) {
                    this.chatHistory = [];
                }

                this.chatHistory.push({
                    type,
                    content,
                    timestamp: new Date().toISOString()
                });

                // 更新项目数据
                this.currentProject.chatHistory = this.chatHistory;
                this.saveProjects();
            }
        } catch (error) {
            console.error('添加消息到历史记录时出错:', error);
            this.showError('添加消息失败: ' + error.message);
        }
    }

    getContextPrompt() {
        // 构建包含历史上下文的提示词
        let prompt = `当前项目：${this.currentProject.name}\n`;
        if (this.currentProject.description) {
            prompt += `项目描述：${this.currentProject.description}\n`;
        }
        prompt += '之前的对话历史\n';
        
        this.chatHistory.forEach(msg => {
            if (msg.type === 'user') {
                prompt += `用户：${msg.content}\n`;
            } else {
                prompt += `AI：[生成了代码]\n`;
            }
        });
        
        return prompt;
    }

    showLoading() {
        this.generateBtn.disabled = true;
        if (this.loadingIndicator && !this.previewArea.contains(this.loadingIndicator)) {
            this.previewArea.appendChild(this.loadingIndicator);
        }
    }

    hideLoading() {
        this.generateBtn.disabled = false;
        if (this.loadingIndicator && this.loadingIndicator.parentNode === this.previewArea) {
            this.previewArea.removeChild(this.loadingIndicator);
        }
    }

    escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    loadSettings() {
        const apiKey = localStorage.getItem('apiKey');
        const promptTemplate = localStorage.getItem('promptTemplate') || '请根据以下需求生成前界面：';
        
        // 重新初始化 AI 服务
        this.initializeAIService();
        this.promptTemplate = promptTemplate;
    }

    renderPreview(response) {
        // 清空预览区域
        this.previewArea.innerHTML = '';
        
        // 创建预览iframe
        const sandbox = document.createElement('iframe');
        sandbox.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        `;
        this.previewArea.appendChild(sandbox);

        // 构建完整的HTML文档
        const content = `
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
                    ${response.html}
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
                        ${response.javascript}
                    } catch (error) {
                        console.error('JavaScript执行错误:', error);
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'error-message';
                        errorDiv.textContent = \`执行错误: \${error.message}\`;
                        document.body.insertBefore(errorDiv, document.body.firstChild);
                    }
                </script>
            </body>
            </html>
        `;

        // 写入内容到iframe
        const iframeDoc = sandbox.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(content);
        iframeDoc.close();

        // 添加全局错误处理
        sandbox.contentWindow.onerror = (msg, url, line) => {
            console.error('预览页面错误:', msg, 'at line:', line);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = `错误: ${msg} (行 ${line})`;
            sandbox.contentWindow.document.body.insertBefore(
                errorDiv,
                sandbox.contentWindow.document.body.firstChild
            );
            return false; // 防止错误冒泡
        };
    }

    loadCurrentSettings() {
        const apiType = document.getElementById('apiType');
        const apiKey = document.getElementById('apiKey');
        const azureResourceName = document.getElementById('azureResourceName');
        const azureDeploymentName = document.getElementById('azureDeploymentName');
        const promptTemplate = document.getElementById('promptTemplate');

        // 从 localStorage 加载设置
        if (apiType) apiType.value = localStorage.getItem('apiType') || 'azure';
        if (apiKey) apiKey.value = localStorage.getItem('apiKey') || '';
        if (azureResourceName) azureResourceName.value = localStorage.getItem('azureResourceName') || '';
        if (azureDeploymentName) azureDeploymentName.value = localStorage.getItem('azureDeploymentName') || '';
        if (promptTemplate) promptTemplate.value = localStorage.getItem('promptTemplate') || '';

        // 根据 API 类型显示/隐藏 Azure 设置
        this.toggleAzureSettings();
    }

    async saveCurrentSettings() {
        try {
            const apiType = document.getElementById('apiType').value;
            const apiKey = document.getElementById('apiKey').value;
            const azureResourceName = document.getElementById('azureResourceName').value;
            const azureDeploymentName = document.getElementById('azureDeploymentName').value;
            const promptTemplate = document.getElementById('promptTemplate').value;

            // 验证必填字段
            if (!apiKey) {
                throw new Error('请输入 API 密钥');
            }

            if (apiType === 'azure') {
                if (!azureResourceName) throw new Error('请输入 Azure 资源名称');
                if (!azureDeploymentName) throw new Error('请输入部署名称');
            }

            // 保存设置到 localStorage
            localStorage.setItem('apiType', apiType);
            localStorage.setItem('apiKey', apiKey);
            localStorage.setItem('azureResourceName', azureResourceName);
            localStorage.setItem('azureDeploymentName', azureDeploymentName);
            localStorage.setItem('promptTemplate', promptTemplate);

            // 重新初始化 AI 服务
            this.initializeAIService();

            // 显示成功消息
            alert('设置已保存');
            
            // 关闭设置模态框
            document.getElementById('settingsModal').style.display = 'none';
        } catch (error) {
            alert(error.message);
        }
    }

    downloadHTML() {
        if (!this.currentProject || !this.chatHistory || this.chatHistory.length === 0) {
            this.showError('没有可下载的内容');
            return;
        }

        // 获取最新的 AI 响应
        const lastAIResponse = this.chatHistory.filter(msg => msg.type === 'ai').pop();
        if (!lastAIResponse) {
            this.showError('没有找到生成的代码');
            return;
        }

        const { html, javascript } = lastAIResponse.content;

        // 构建完整的 HTML 文档
        const fullHTML = `
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
        ${html}
    </div>
    <script>
        ${javascript}
    </script>
</body>
</html>`;

        // 创建 Blob 对象
        const blob = new Blob([fullHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // 创建下载链接
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentProject.name}-prototype.html`;
        document.body.appendChild(a);
        a.click();

        // 清理
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    initResizer() {
        const resizer = document.querySelector('.resizer');
        const leftPanel = document.querySelector('.left-panel');
        const rightPanel = document.querySelector('.right-panel');
        const chatInput = document.querySelector('.chat-input');

        let isResizing = false;
        let startX;
        let startWidth;

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.pageX;
            startWidth = leftPanel.offsetWidth;

            // 添加临时事件监听器
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            // 添加正在拖拽的状态类
            document.body.classList.add('resizing');
        });

        function handleMouseMove(e) {
            if (!isResizing) return;

            const width = startWidth + (e.pageX - startX);
            const containerWidth = document.querySelector('.container').offsetWidth;
            
            // 限制最小和最大宽度
            const minWidth = 300;
            const maxWidth = containerWidth - 300;
            
            if (width >= minWidth && width <= maxWidth) {
                const widthPercentage = (width / containerWidth) * 100;
                leftPanel.style.width = `${widthPercentage}%`;
                rightPanel.style.width = `${100 - widthPercentage}%`;
                
                // 同时调整输入框宽度
                if (chatInput) {
                    chatInput.style.width = `${widthPercentage}%`;
                }
            }
        }

        function handleMouseUp() {
            isResizing = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.classList.remove('resizing');
        }
    }
}

// 确保 DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PrototypeGenerator();
}); 