class EstoqueManager {
    constructor() {
        this.pecas = [];
        this.form = document.getElementById('pecaForm');
        this.tableBody = document.getElementById('inventoryBody');
        this.currentEditingCode = null;
        this.itemsPerPage = 20;
        this.currentPage = 1;
        this.searchTerm = '';
        this.apiUrl = '/estoque/php/api.php'; // Updated to lowercase
        this.isSubmitting = false;

        this.initializeEventListeners();
        this.loadPecas();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Adiciona validação de entrada
        document.getElementById('quantidade').addEventListener('input', (e) => {
            if (e.target.value < 0) e.target.value = 0;
        });

        // Add search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.currentPage = 1;
            this.renderTable();
        });

        // Debounce scroll handler for mobile
        let timeout;
        this.tableBody.addEventListener('scroll', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (this.tableBody.scrollHeight - this.tableBody.scrollTop === this.tableBody.clientHeight) {
                    this.loadMoreItems();
                }
            }, 150);
        });
    }

    showMessage(message, isError = false) {
        const div = document.createElement('div');
        div.textContent = message;
        div.className = isError ? 'error-message' : 'success-message';
        div.style.display = 'block';
        this.form.insertAdjacentElement('beforebegin', div);

        setTimeout(() => div.remove(), 3000);
    }

    handleSubmit(e) {
        e.preventDefault();
        const peca = {
            codigo: document.getElementById('codigo').value.trim(),
            nome: document.getElementById('nome').value.trim(),
            quantidade: parseInt(document.getElementById('quantidade').value),
            localizacao: document.getElementById('localizacao').value.trim(),
            dataAtualizacao: new Date().toLocaleString()
        };

        if (this.currentEditingCode) {
            this.updatePeca(peca);
        } else {
            this.addPeca(peca);
        }
    }

    async loadPecas() {
        try {
            const response = await fetch(this.apiUrl);
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Erro desconhecido');
            }

            this.pecas = result.data || [];
            this.renderTable();
        } catch (error) {
            console.error('Erro completo:', error);
            this.showMessage('Erro ao carregar peças: ' + error.message, true);
        }
    }

    async addPeca(peca) {
        if (this.isSubmitting) return;
        this.isSubmitting = true;
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(peca)
            });

            const result = await response.json();

            // Modificado para tratar tanto success: false quanto error explícito
            if (!result.success) {
                const errorMessage = result.error || result.message || 'Erro desconhecido ao adicionar peça';
                throw new Error(errorMessage);
            }

            await this.loadPecas();
            this.showMessage('Peça adicionada com sucesso!');
            this.resetForm();
        } catch (error) {
            // Exibe a mensagem de erro diretamente
            this.showMessage(error.message, true);

            // Se for erro de código duplicado, destaca o campo
            if (error.message.includes('já existe')) {
                const codigoInput = document.getElementById('codigo');
                codigoInput.focus();
                codigoInput.classList.add('error-input');
                setTimeout(() => codigoInput.classList.remove('error-input'), 3000);
            }
        } finally {
            this.isSubmitting = false;
        }
    }

    async updatePeca(peca) {
        try {
            // Inclui oldCodigo para o backend poder diferenciar
            peca.oldCodigo = this.currentEditingCode;

            const response = await fetch(this.apiUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(peca)
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            await this.loadPecas();
            this.showMessage('Peça atualizada com sucesso!');
            this.resetForm();
            this.currentEditingCode = null;
        } catch (error) {
            this.showMessage('Erro ao atualizar peça: ' + error.message, true);
        }
    }

    async removePeca(codigo) {
        if (!confirm('Tem certeza que deseja remover esta peça?')) return;

        try {
            const response = await fetch(`${this.apiUrl}?codigo=${codigo}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            await this.loadPecas();
            this.showMessage('Peça removida com sucesso!');
        } catch (error) {
            this.showMessage('Erro ao remover peça: ' + error.message, true);
        }
    }

    editPeca(codigo) {
        const peca = this.pecas.find(p => p.codigo === codigo);
        if (peca) {
            document.getElementById('codigo').value = peca.codigo;
            document.getElementById('nome').value = peca.nome;
            document.getElementById('quantidade').value = peca.quantidade;
            document.getElementById('localizacao').value = peca.localizacao;
            this.currentEditingCode = codigo;
            document.querySelector('button[type="submit"]').textContent = 'Atualizar';
        }
    }

    resetForm() {
        this.form.reset();
        this.currentEditingCode = null;
        document.querySelector('button[type="submit"]').textContent = 'Salvar';
        this.renderTable();
    }

    getFilteredPecas() {
        return this.pecas.filter(peca =>
            peca.codigo.toLowerCase().includes(this.searchTerm) ||
            peca.nome.toLowerCase().includes(this.searchTerm) ||
            peca.localizacao.toLowerCase().includes(this.searchTerm)
        );
    }

    getPaginatedPecas() {
        const filtered = this.getFilteredPecas();
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return filtered.slice(start, start + this.itemsPerPage);
    }

    loadMoreItems() {
        if (this.getPaginatedPecas().length === this.getFilteredPecas().length) return;
        this.currentPage++;
        this.renderTable(true); // true = append mode
    }

    renderTable(append = false) {
        const paginatedPecas = this.getPaginatedPecas();
        const html = paginatedPecas.map(peca => `
            <tr>
                <td data-label="Código">
                    <i class="fas fa-barcode"></i> ${this.escapeHtml(peca.codigo)}
                </td>
                <td data-label="Nome">
                    <i class="fas fa-tag"></i> ${this.escapeHtml(peca.nome)}
                </td>
                <td data-label="Quantidade">
                    <i class="fas fa-calculator"></i> ${peca.quantidade}
                </td>
                <td data-label="Localização">
                    <i class="fas fa-map-marker-alt"></i> ${this.escapeHtml(peca.localizacao || '-')}
                </td>
                <td data-label="Ações">
                    <button class="btn-edit" onclick="estoqueManager.editPeca('${this.escapeHtml(peca.codigo)}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-delete" onclick="estoqueManager.removePeca('${this.escapeHtml(peca.codigo)}')">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </td>
            </tr>
        `).join('');

        if (append) {
            this.tableBody.innerHTML += html;
        } else {
            this.tableBody.innerHTML = html;
        }

        this.updatePaginationInfo();
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    updatePaginationInfo() {
        const total = this.getFilteredPecas().length;
        const showing = this.getPaginatedPecas().length;
        document.getElementById('paginationInfo').textContent =
            `Mostrando ${showing} de ${total} itens`;
    }
}

// Inicializa o gerenciador de estoque
const estoqueManager = new EstoqueManager();
