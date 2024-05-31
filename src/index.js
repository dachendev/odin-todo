import './style.css';
import { setupProjectModal, renderProjectList } from './modules/projects.js';

function domLoaded() {
    /* Setup projects */

    setupProjectModal();
    renderProjectList();

    // Dismiss modal
    document.querySelectorAll('[data-dismiss="modal"]').forEach(el => {
        el.addEventListener('click', () => {
            var openModal = document.querySelector('.modal[open]');
            if (openModal) {
                openModal.close();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', domLoaded);