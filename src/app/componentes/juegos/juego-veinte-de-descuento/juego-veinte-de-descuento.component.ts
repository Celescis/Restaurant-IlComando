import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
enum CellState {
  Hidden = 'hidden',
  Revealed = 'revealed',
  Flagged = 'flagged'
}

@Component({
  selector: 'app-juego-veinte-de-descuento',
  templateUrl: './juego-veinte-de-descuento.component.html',
  styleUrls: ['./juego-veinte-de-descuento.component.scss'],
})
export class JuegoVeinteDeDescuentoComponent implements OnInit {
  @Input() pedidoRecibido?: any;
  @Output() PasamosPedidoConJuego: EventEmitter<any> = new EventEmitter<any>();


  spinner: boolean = false;
  user: any = this.authService.UsuarioActivo;

  board: number[][] = [];
  states: CellState[][] = [];
  rows: number = 10;
  cols: number = 10;
  mines: number = 10;
  revealedCount: number = 0;
  gameOver: boolean = false;

  ms: number = 0;
  segundos: number = 0;
  minutos: number = 0;
  timerImages: string[] = [];
  timerId: any;
  tiempoFinal: any = 0;
  flagCount: number = 0;
  remainingFlags: number = 10;
  flagsImages: string[] = [];
  victory: boolean = false;

  constructor(
    private authService: AuthService, private toastController: ToastController) {
    this.resetGame();
  }

  ngOnInit() {
    this.flagCount = 0;
    this.remainingFlags = 10;
    this.timerImages = [
      `/assets/buscaminas/time0.gif`,
      `/assets/buscaminas/time0.gif`,
      `/assets/buscaminas/time0.gif`
    ];
  }

  resetGame() {
    this.board = [];
    this.states = [];
    this.revealedCount = 0;

    for (let i = 0; i < this.rows; i++) {
      this.board[i] = [];
      this.states[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.board[i][j] = 0;
        this.states[i][j] = CellState.Hidden;
      }
    }
    this.flagCount = 0;
    this.remainingFlags = 10;
    this.placeMines();
    this.calculateNumbers();
    this.resetTimer();
    this.updateFlagsImages();
    this.gameOver = false;
    this.victory = false;
  }

  startTimer() {
    this.timerId = setInterval(() => {
      this.ms++;

      if (this.ms > 9) {
        this.ms = 0;
        this.segundos++;

        if (this.segundos == 6) {
          this.segundos = 0;
          this.minutos++;

          if (this.minutos > 9) {
            this.minutos = 0;
          }
        }
      }

      this.updateTimerImages();
    }, 1000);
  }

  updateTimerImages() {
    const formattedSeconds = this.padNumber(this.ms);
    const formattedMinutes = this.padNumber(this.segundos);
    const formattedHours = this.padNumber(this.minutos);

    this.timerImages = [
      `/assets/buscaminas/time${formattedHours}.gif`,
      `/assets/buscaminas/time${formattedMinutes}.gif`,
      `/assets/buscaminas/time${formattedSeconds}.gif`
    ];
    this.tiempoFinal = formattedHours + ":" + formattedMinutes + "." + formattedSeconds;
  }

  padNumber(number: number): string {
    return number.toString().padStart(1, '0');
  }

  resetTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.segundos = 0;
    this.minutos = 0;
    this.ms = 0;
    this.timerImages = [
      `/assets/buscaminas/time0.gif`,
      `/assets/buscaminas/time0.gif`,
      `/assets/buscaminas/time0.gif`
    ];
  }

  placeMines() {
    let count = 0;
    while (count < this.mines) {
      const row = Math.floor(Math.random() * this.rows);
      const col = Math.floor(Math.random() * this.cols);
      if (this.board[row][col] !== -1) {
        this.board[row][col] = -1;
        count++;
      }
    }
  }

  calculateNumbers() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.board[i][j] !== -1) {
          let count = 0;
          if (i > 0 && j > 0 && this.board[i - 1][j - 1] === -1) count++;
          if (i > 0 && this.board[i - 1][j] === -1) count++;
          if (i > 0 && j < this.cols - 1 && this.board[i - 1][j + 1] === -1) count++;
          if (j > 0 && this.board[i][j - 1] === -1) count++;
          if (j < this.cols - 1 && this.board[i][j + 1] === -1) count++;
          if (i < this.rows - 1 && j > 0 && this.board[i + 1][j - 1] === -1) count++;
          if (i < this.rows - 1 && this.board[i + 1][j] === -1) count++;
          if (i < this.rows - 1 && j < this.cols - 1 && this.board[i + 1][j + 1] === -1) count++;
          this.board[i][j] = count;
        }
      }
    }
  }

  clickCell(row: number, col: number) {
    if (!this.timerId) {
      this.startTimer();
    }
    if (this.states[row][col] !== CellState.Hidden && this.states[row][col] === CellState.Flagged) {
      return;
    }

    //PERDI
    if (this.board[row][col] === -1) {
      this.board[row][col] = -2;
      this.revealAllCells();
      this.gameOver = true;
      this.resetTimer();
      // this.createResult();
      this.presentToast('¡PERDISTE!', 'danger', 'thumbs-down-outline');
    } else {//GANE
      this.revealCell(row, col);
      if (this.revealedCount === (this.rows * this.cols - this.mines)) {
        this.victory = true;
        this.resetTimer();
        // this.createResult();
        this.presentToast('¡GANASTE 20% DE DESCUENTO!', 'success', 'ribbon-outline');
      }
    }
    if (this.gameOver || this.victory) {
      this.spinner = true;
      setTimeout(() => {
        this.spinner = false;
        if (this.pedidoRecibido.jugo == false) {
          this.pedidoRecibido.jugo = true;
          if (this.victory) {
            this.pedidoRecibido.descuentoJuego += 20;
          } else {
            this.pedidoRecibido.descuentoJuego += 0;
          }
        }
        this.PasamosPedidoConJuego.emit(this.pedidoRecibido);
      }, 1500);
    }
  }

  revealCell(row: number, col: number) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols || this.states[row][col] === CellState.Revealed) {
      return;
    }

    this.states[row][col] = CellState.Revealed;
    this.revealedCount++;

    if (this.board[row][col] === 0) {
      this.revealCell(row - 1, col - 1);
      this.revealCell(row - 1, col);
      this.revealCell(row - 1, col + 1);
      this.revealCell(row, col - 1);
      this.revealCell(row, col + 1);
      this.revealCell(row + 1, col - 1);
      this.revealCell(row + 1, col);
      this.revealCell(row + 1, col + 1);
    }
  }

  flagCell(row: number, col: number, event: MouseEvent) {
    event.preventDefault();

    if (this.states[row][col] === CellState.Hidden && this.flagCount < 10) {
      this.states[row][col] = CellState.Flagged;
      this.flagCount++;
      this.remainingFlags--;
      this.updateFlagsImages();
    } else if (this.states[row][col] === CellState.Flagged) {
      this.states[row][col] = CellState.Hidden;
      this.flagCount--;
      this.remainingFlags++;
      this.updateFlagsImages();
    }

  }

  updateFlagsImages() {

    if (this.remainingFlags == 10) {
      const formattedTwo = this.padNumber(1);
      const formattedThree = this.padNumber(0);

      this.flagsImages = [
        `/assets/buscaminas/time${formattedTwo}.gif`,
        `/assets/buscaminas/time${formattedThree}.gif`
      ];
    }
    else {
      const formatted1 = this.padNumber(0);
      const formatted2 = this.padNumber(this.remainingFlags);

      this.flagsImages = [
        `/assets/buscaminas/time${formatted1}.gif`,
        `/assets/buscaminas/time${formatted2}.gif`
      ];
    }
  }

  revealAllCells() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.states[i][j] = CellState.Revealed;
      }
    }
  }

  getStateClass(row: number, col: number): string {
    const state = this.states[row][col];
    switch (state) {
      case CellState.Hidden:
        return 'hidden';
      case CellState.Revealed:
        return 'revealed';
      case CellState.Flagged:
        return 'flagged';
      default:
        return '';
    }
  }
  // createResult() {
  //   let resultado = {
  //     juego: 'Buscaminas',
  //     puntaje: this.tiempoFinal,
  //     mail: this.authService.emailLogueado,
  //     victoria: this.victory
  //   }

  //   this.firestore.guardarResultado(resultado);
  // }
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