import React from 'react';
import { X } from 'react-feather';
import './Modal.css'; // Vamos criar este CSS já a seguir

/**
 * Um componente de Modal reutilizável.
 *
 * Props:
 * - isOpen (boolean): Controla se o modal está visível.
 * - onClose (function): Chamada quando o modal deve ser fechado (clique no 'X' ou 'Cancelar').
 * - onConfirm (function): Chamada quando o botão de confirmação é clicado.
 * - title (string): O título do modal.
 * - children (node): O conteúdo (mensagem) do modal.
 * - type ('alert' | 'confirm'): 'alert' mostra só "OK", 'confirm' mostra "Cancelar" e "Confirmar".
 * - confirmText (string): Texto do botão de confirmação (ex: "Remover", "OK").
 * - confirmClass ('primary' | 'danger'): Estilo do botão ('danger' = vermelho).
 */
function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  type = 'alert', // 'alert' por defeito
  confirmText = 'OK',
  confirmClass = 'primary' // 'primary' (cinza) por defeito
}) {

  if (!isOpen) {
    return null; // Não renderiza nada se estiver fechado
  }

  // Impede que o clique *dentro* do modal o feche
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // O 'onMouseDown' no overlay permite fechar ao clicar fora,
    // mas 'onMouseDown' é usado para disparar antes do 'onClick' do botão
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-content" onMouseDown={handleContentClick}>
        
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        <div className="modal-footer">
          {/* Mostra o botão "Cancelar" apenas se for do tipo 'confirm' */}
          {type === 'confirm' && (
            <button
              onClick={onClose}
              className="modal-button cancel"
            >
              Cancelar
            </button>
          )}

          {/* Botão de Confirmação (ou "OK") */}
          <button
            onClick={onConfirm || onClose} // Se onConfirm não for dado, apenas fecha (comportamento de 'alert')
            className={`modal-button ${confirmClass}`} // Aplica a classe de estilo
          >
            {confirmText}
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default Modal;