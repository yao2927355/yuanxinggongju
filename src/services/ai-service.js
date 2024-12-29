class AIService {
    constructor(apiKey, options = {}) {
        if (!apiKey) {
            console.warn('API 密钥未设置');
        }
        
        this.apiKey = apiKey;
        this.apiType = options.apiType || 'azure';
        this.azureResourceName = options.azureResourceName;
        this.azureDeploymentName = options.azureDeploymentName;
    }

    async generateCode(message, context) {
        if (!this.apiKey) {
            throw new Error('请先在设置中配置 API 密钥');
        }

        if (this.apiType === 'azure' && (!this.azureResourceName || !this.azureDeploymentName)) {
            throw new Error('请先完成 Azure OpenAI 配置');
        }

        try {
            const endpoint = this.apiType === 'azure' 
                ? `https://${this.azureResourceName}.openai.azure.com/openai/deployments/${this.azureDeploymentName}/chat/completions?api-version=2024-02-15-preview`
                : 'https://api.openai.com/v1/chat/completions';

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            };

            if (this.apiType === 'azure') {
                headers['api-key'] = this.apiKey;
                delete headers['Authorization'];
            }

            const systemPrompt = `你是一个专业的前端开发专家。请生成符合以下格式的JSON响应：

{
    "html": "这里是HTML代码",
    "javascript": "这里是JavaScript代码",
    "css": "这里是CSS代码",
    "description": "这里是说明"
}

注意：
1. 所有代码都应该使用引号包裹
2. 避免使用特殊字符和换行符
3. 确保生成的是有效的JSON格式
4. 代码中的引号需要正确转义

生成要求：
1. 代码风格：
   - 使用现代、简洁的代码风格
   - 代码要有适当的注释
   - 使用语义化的 HTML 标签
   - 采用 BEM 命名规范的 CSS 类名

2. 功能实现：
   - 使用原生 JavaScript，不依赖外部库
   - 确保代码有适当的错误处理
   - 添加必要的输入验证
   - 实现响应式设计

3. 用户体验：
   - 添加适当的交互反馈
   - 确保界面美观且易用
   - 添加合适的动画效果
   - 保持一致的设计风格

4. 性能考虑：
   - 优化 DOM 操作
   - 使用事件委托
   - 避免内存泄漏
   - 确保平滑的动画效果

5. 兼容性：
   - 确保跨浏览器兼容性
   - 在使用新特性时添加兼容性检查
   - 提供优雅的降级方案

用户需求：
${message}

请生成一个完整的解决方案，包括：
1. 符合现代标准的 HTML 结构
2. 美观的样式和布局
3. 完整的交互功能
4. 详细的实现说明

注意：
- 确保代码可以独立运行
- 提供清晰的注释
- 考虑错误处理
- 注重用户体验
`;

            const userPrompt = `
项目上下文：
${context}
`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: userPrompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 4000,
                    top_p: 0.9,
                    frequency_penalty: 0.3,
                    presence_penalty: 0.3
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || '请求失败');
            }

            const data = await response.json();
            const content = data.choices[0].message.content;

            try {
                // 改进 JSON 提取和解析
                let jsonContent = content;
                
                // 如果内容包含反引号或其他格式，尝试提取 JSON 部分
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    jsonContent = jsonMatch[0];
                }

                // 清理可能导致解析错误的字符
                jsonContent = jsonContent
                    .replace(/\\n/g, '\\n')
                    .replace(/\\'/g, "\\'")
                    .replace(/\\"/g, '\\"')
                    .replace(/\\&/g, '\\&')
                    .replace(/\\r/g, '\\r')
                    .replace(/\\t/g, '\\t')
                    .replace(/\\b/g, '\\b')
                    .replace(/\\f/g, '\\f')
                    .replace(/[\u0000-\u0019]+/g, ''); // 移除不可打印字符

                // 尝试解析 JSON
                const parsedContent = JSON.parse(jsonContent);

                // 验证和规范化返回的内容
                const normalizedContent = {
                    html: parsedContent.html || '',
                    javascript: parsedContent.javascript || '',
                    css: parsedContent.css || '',
                    description: parsedContent.description || ''
                };

                // 合并 CSS 到 HTML
                if (normalizedContent.css) {
                    normalizedContent.html = `
                        <style>
                            ${normalizedContent.css}
                        </style>
                        ${normalizedContent.html}
                    `;
                }

                // 添加基础包装
                normalizedContent.html = `
                    <div class="generated-content">
                        ${normalizedContent.html}
                    </div>
                `;

                return normalizedContent;
            } catch (e) {
                console.error('JSON 解析错误:', e);
                console.log('原始内容:', content);

                // 尝试手动提取内容
                const htmlMatch = content.match(/["']html["']\s*:\s*["']([\s\S]*?)["']/);
                const jsMatch = content.match(/["']javascript["']\s*:\s*["']([\s\S]*?)["']/);
                const cssMatch = content.match(/["']css["']\s*:\s*["']([\s\S]*?)["']/);
                const descMatch = content.match(/["']description["']\s*:\s*["']([\s\S]*?)["']/);

                return {
                    html: htmlMatch ? htmlMatch[1] : '<!-- 无法解析 HTML -->',
                    javascript: jsMatch ? jsMatch[1] : '// 无法解析 JavaScript',
                    css: cssMatch ? cssMatch[1] : '/* 无法解析 CSS */',
                    description: descMatch ? descMatch[1] : '解析错误: ' + e.message
                };
            }
        } catch (error) {
            console.error('AI 服务错误:', error);
            throw new Error(`AI 服务错误: ${error.message}`);
        }
    }

    processGeneratedCode(content) {
        try {
            const parsedContent = JSON.parse(content);
            
            // 合并 CSS 到 HTML
            if (parsedContent.css) {
                parsedContent.html = `
                    <style>
                        ${parsedContent.css}
                    </style>
                    ${parsedContent.html}
                `;
            }

            // 添加基础样式
            parsedContent.html = `
                <div class="generated-content">
                    ${parsedContent.html}
                </div>
            `;

            return parsedContent;
        } catch (e) {
            console.error('处理生成的代码时出错:', e);
            return {
                html: '<!-- 生成的代码格式不正确 -->',
                javascript: '// 生成的代码格式不正确',
                description: '解析错误: ' + e.message
            };
        }
    }
}

// 确保类可以被访问
if (typeof window !== 'undefined') {
    window.AIService = AIService;
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIService;
} 