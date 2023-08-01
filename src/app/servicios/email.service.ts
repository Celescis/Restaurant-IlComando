import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { init } from 'emailjs-com';
init('VqVex_-w4d90-6l_G');

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor() { }

  enviarAvisoPendienteAprobacion(usuario: any) {
    const templateParams = {
      to_name: usuario.nombre,
      message:
        'Para poder acceder a tu cuenta debes esperar que sea aprobada. Por favor ten paciencia.',
      logoUrl: 'https://firebasestorage.googleapis.com/v0/b/pps-lacomanda-a7bf0.appspot.com/o/icon.png?alt=media&token=80f0a5f4-56fc-4b38-a856-523961e51fba',
      from_name: 'IL COMANDO',
      email_cliente: usuario.email,
    };

    emailjs
      .send('service_o7hfh9d', 'template_o2ccsm2', templateParams)
      .then((res) => {
        console.log('Email enviado.', res.status, res.text);
      })
      .catch((error) => {
        console.log('Error al enviar el email.', error.message);
      });
  }

  enviarAvisoCuentaAprobada(usuario: any) {
    const templateParams = {
      to_name: usuario.nombre,
      message:
        'Tu cuenta ha sido aprobada, ya puedes ingresar a la aplicación.',
      logoUrl: 'https://firebasestorage.googleapis.com/v0/b/pps-lacomanda-a7bf0.appspot.com/o/icon.png?alt=media&token=80f0a5f4-56fc-4b38-a856-523961e51fba',
      from_name: 'IL COMANDO',
      email_cliente: usuario.email,
    };

    emailjs
      .send('service_o7hfh9d', 'template_o2ccsm2', templateParams)
      .then((res) => {
        console.log('Email enviado.', res.status, res.text);
      })
      .catch((error) => {
        console.log('Error al enviar el email.', error.message);
      });
  }

  enviarAvisoCuentaDeshabilitada(usuario: any) {
    const templateParams = {
      to_name: usuario.nombre,
      message:
        'Tu cuenta ha sido deshabilitada, por favor comunicate con nosotros para saber las causas.',
      logoUrl: 'https://firebasestorage.googleapis.com/v0/b/pps-lacomanda-a7bf0.appspot.com/o/icon.png?alt=media&token=80f0a5f4-56fc-4b38-a856-523961e51fba',
      from_name: 'IL COMANDO',
      email_cliente: usuario.email,
    };

    emailjs
      .send('service_o7hfh9d', 'template_o2ccsm2', templateParams)
      .then((res) => {
        console.log('Email enviado.', res.status, res.text);
      })
      .catch((error) => {
        console.log('Error al enviar el email.', error.message);
      });
  }
}
