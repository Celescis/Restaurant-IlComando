import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-juego-diez-de-descuento',
  templateUrl: './juego-diez-de-descuento.component.html',
  styleUrls: ['./juego-diez-de-descuento.component.scss'],
})
export class JuegoDiezDeDescuentoComponent implements OnInit {
  @Input() pedidoRecibido?: any;
  @Output() PasamosPedidoConJuego: EventEmitter<any> = new EventEmitter<any>();

  spinner: boolean = false;
  user: any = this.authService.UsuarioActivo;
  buttonLetters: string[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'Ñ',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  listOfWords: string[] = [
    'PERRO',
    'SERPIENTE',
    'KOALA',
    'SAPO',
    'GATO'
  ];
  victory: boolean = false;
  activeGame: boolean = true;
  attempts: number = 6;
  score: number = 0;
  image: number | any = 0;
  word: string = '';
  hyphenatedWord: string[] = [];

  constructor(
    private toastController: ToastController,
    public authService: AuthService
  ) {
    this.word =
      this.listOfWords[
      Math.round(Math.random() * (this.listOfWords.length - 1))
      ];
    this.hyphenatedWord = Array(this.word.length).fill('_');
  }

  ngOnInit(): void { }

  restartGame() {
    this.word =
      this.listOfWords[
      Math.round(Math.random() * (this.listOfWords.length - 1))
      ];
    this.hyphenatedWord = Array(this.word.length).fill('_');
    this.activeGame = true;
    this.attempts = 6;
    this.score = 0;
    this.image = 0;
    this.victory = false;
    this.resetClassBotones();
    // this.notifyService.showInfo('Reiniciando partida...', 'Ahorcado');
  } // end of restartGame

  resetClassBotones() {
    for (let index = 0; index < this.buttonLetters.length; index++) {
      const elemento = document.getElementById("boton" + index) as HTMLButtonElement;
      elemento?.classList.remove("btn-error");
      elemento?.classList.remove("btn-acierto");
      elemento?.classList.add("btn-letra");
      if (elemento != null) {
        elemento.disabled = false;
      }
    }
  }

  sendLetter(letter: string, idDelBoton: number) {
    let letterFlag: boolean = false;
    let winGame: boolean = false;

    if (this.activeGame) {
      const alreadyGuessedLetterFlag: boolean = this.hyphenatedWord.some(
        (c) => c === letter
      );
      for (let i = 0; i < this.word.length; i++) {
        const wordLetter = this.word[i];
        if (wordLetter === letter && !alreadyGuessedLetterFlag) {
          this.hyphenatedWord[i] = letter;
          letterFlag = true;
          this.score++;
          winGame = this.hyphenatedWord.some((hyphen) => hyphen == '_');
          if (!winGame) {
            this.image = this.image + '_v';
            this.activeGame = false;
            this.victory = true;
            // this.createResult();
            this.presentToast('¡GANASTE 10% DE DESCUENTO!', 'success', 'ribbon-outline');
            this.spinner = true;
            setTimeout(() => {
              this.spinner = false;
              if (this.pedidoRecibido.jugo == false) {
                this.pedidoRecibido.jugo = true;
                if (this.victory) {
                  this.pedidoRecibido.descuentoJuego += 10;
                } else {
                  this.pedidoRecibido.descuentoJuego += 0;
                }
              }
              this.PasamosPedidoConJuego.emit(this.pedidoRecibido);
            }, 1500);
            break;
          }
        }
      }

      if (!letterFlag && !alreadyGuessedLetterFlag) {
        if (this.attempts > 0) {
          this.attempts--;
          this.image++;
          // this.toastService.showError('¡Te equivocaste!', 'Ahorcado');
          const elemento = document.getElementById("boton" + idDelBoton) as HTMLButtonElement;
          elemento?.classList.remove("btn-letra");
          elemento?.classList.add("btn-error");
          if (elemento != null) {
            elemento.disabled = true;
          }
          if (this.attempts === 0) {
            // this.createResult();
            this.presentToast('¡PERDISTE!', 'danger', 'thumbs-down-outline');
            this.spinner = true;
            setTimeout(() => {
              this.spinner = false;
              if (this.pedidoRecibido.jugo == false) {
                this.pedidoRecibido.jugo = true;
                if (this.victory) {
                  this.pedidoRecibido.descuentoJuego += 10;
                } else {
                  this.pedidoRecibido.descuentoJuego += 0;
                }
              }
              this.PasamosPedidoConJuego.emit(this.pedidoRecibido);
            }, 1500);
            this.activeGame = false;
          }
        }

        if (this.score > 0) {
          this.score--;
        }
      } else if (alreadyGuessedLetterFlag) {
        this.presentToast('Esta letra ya fue utilizada', 'Ahorcado', 'warning');
      } else if (letterFlag) {
        if (!this.victory) {
          // this.toastService.showSuccess('Acertaste!!', 'Ahorcado');
          const elemento = document.getElementById("boton" + idDelBoton) as HTMLButtonElement;
          elemento?.classList.remove("btn-letra");
          elemento?.classList.add("btn-acierto");
          if (elemento != null) {
            elemento.disabled = true;
          }
        }
      }
    }
  }

  generarPista() {
    switch (this.word) {
      case 'PERRO':
        this.presentToast("Animal de cuatro patas muy amistoso", "danger", 'bulb-outline');
        break;

      case 'SERPIENTE':
        this.presentToast("Animal largo que se arrastra", "danger ", 'bulb-outline');
        break;

      case 'KOALA':
        this.presentToast("Animal perezoso que trepa árboles", "danger ", 'bulb-outline');
        break;

      case 'SAPO':
        this.presentToast("Animal verde acuático", "danger", 'bulb-outline');
        break;

      default:
        this.presentToast("Animal peludo que ronronea", "danger", 'bulb-outline');
        break;
    }
  }

  // createResult() {
  //   let resultado = {
  //     juego:'Ahorcado',
  //     puntaje: this.score,
  //     mail: this.authService.emailLogueado,
  //     victoria:this.victory
  //   }

  //   this.firestore.guardarResultado(resultado);
  // }\

  async presentToast(mensaje: string, color: string, icon: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      icon: icon,
      color: color
    });

    await toast.present();
  }
}