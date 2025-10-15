import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="editor-container">
      <div class="toolbar">
        <button (click)="execCmd('bold')" title="Negrito" class="toolbar-btn">
          <strong>B</strong>
        </button>
        <button (click)="execCmd('italic')" title="Itálico" class="toolbar-btn">
          <em>I</em>
        </button>
        <button (click)="execCmd('underline')" title="Sublinhado" class="toolbar-btn">
          <u>U</u>
        </button>
        
        <div class="divider"></div>
        
        <button (click)="execCmd('insertUnorderedList')" title="Lista" class="toolbar-btn">
          ☰
        </button>
        <button (click)="execCmd('insertOrderedList')" title="Lista Numerada" class="toolbar-btn">
          1. 2. 3.
        </button>
        
        <div class="divider"></div>
        
        <button (click)="insertTable()" title="Inserir Tabela" class="toolbar-btn">
          ⊞
        </button>
        <button (click)="triggerImageUpload()" title="Inserir Imagem" class="toolbar-btn">
          🖼️
        </button>
        
        <input 
          #fileInput 
          type="file" 
          accept="image/*" 
          (change)="handleImageUpload($event)"
          style="display: none"
        />
        
        <div class="divider"></div>
        
        <button (click)="togglePreview()" class="toolbar-btn preview-btn">
          {{ isPreview() ? '✏️ Editar' : '👁️ Preview' }}
        </button>
      </div>

      @if (!isPreview()) {
        <div 
          #editor
          class="editor-content"
          contenteditable="true"
          (input)="onContentChange()"
        ></div>
      } @else {
        <div class="preview-content" [innerHTML]="sanitizedContent()"></div>
      }
    </div>
  `,
  styles: [`
    .editor-container {
      max-width: 800px;
      margin: 20px auto;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .toolbar {
      display: flex;
      gap: 4px;
      padding: 12px;
      background: #f5f5f5;
      border-bottom: 1px solid #ddd;
      flex-wrap: wrap;
    }

    .toolbar-btn {
      padding: 8px 12px;
      border: 1px solid #ccc;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }

    .toolbar-btn:hover {
      background: #e9ecef;
      border-color: #999;
    }

    .toolbar-btn:active {
      background: #dee2e6;
    }

    .preview-btn {
      margin-left: auto;
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .preview-btn:hover {
      background: #0056b3;
      border-color: #0056b3;
    }

    .divider {
      width: 1px;
      background: #ccc;
      margin: 0 8px;
    }

    .editor-content, .preview-content {
      min-height: 400px;
      padding: 20px;
      outline: none;
      background: white;
      line-height: 1.6;
    }

    .preview-content {
      background: #fafafa;
    }

    .editor-content:focus {
      background: #fffef8;
    }

    /* Estilos para o conteúdo */
    :host ::ng-deep .editor-content table,
    :host ::ng-deep .preview-content table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }

    :host ::ng-deep .editor-content td,
    :host ::ng-deep .preview-content td {
      border: 1px solid #ddd;
      padding: 8px;
      min-width: 80px;
    }

    :host ::ng-deep .editor-content img,
    :host ::ng-deep .preview-content img {
      max-width: 100%;
      height: auto;
      margin: 16px 0;
      border-radius: 4px;
    }

    :host ::ng-deep .editor-content ul,
    :host ::ng-deep .editor-content ol,
    :host ::ng-deep .preview-content ul,
    :host ::ng-deep .preview-content ol {
      margin: 12px 0;
      padding-left: 32px;
    }

    :host ::ng-deep .editor-content li,
    :host ::ng-deep .preview-content li {
      margin: 4px 0;
    }
  `]
})
export class RichTextEditorComponent {
  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;
  
  private content = signal('');
  isPreview = signal(false);
  
  constructor(private sanitizer: DomSanitizer) {}

  sanitizedContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.content());
  }

  execCmd(command: string, value?: string) {
    document.execCommand(command, false, value);
    this.editorRef?.nativeElement.focus();
  }

  onContentChange() {
    if (this.editorRef?.nativeElement) {
      this.content.set(this.editorRef.nativeElement.innerHTML);
    }
  }

  insertTable() {
    const rows = prompt('Número de linhas:', '3');
    const cols = prompt('Número de colunas:', '3');
    
    if (rows && cols) {
      let tableHTML = '<table><tbody>';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td>Célula</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</tbody></table><p><br></p>';
      
      this.execCmd('insertHTML', tableHTML);
    }
  }

  triggerImageUpload() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgHTML = `<img src="${e.target?.result}" alt="Imagem" /><p><br></p>`;
        this.execCmd('insertHTML', imgHTML);
      };
      reader.readAsDataURL(file);
      input.value = '';
    }
  }

  togglePreview() {
    this.isPreview.update(v => !v);
  }
}
