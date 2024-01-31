import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PoBreadcrumb,
  PoModalAction,
  PoModalComponent,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-nova-forma-de-pagamento',
  templateUrl: './nova-forma-de-pagamento.component.html',
  styleUrls: ['./nova-forma-de-pagamento.component.css'],
})
export class NovaFormaDePagamentoComponent {
  @ViewChild('modalCancel', { static: false })
  modalCancel!: PoModalComponent;

  public codPayment: string = '';
  public descPayment: string = '';
  public title: string = 'Nova forma de pagamento';
  public isShowLoading: boolean = false;
  public editView: boolean = false;
  public breadcrumb!: PoBreadcrumb;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    this._activatedRoute.queryParams.subscribe((params) => {
      if (params['codPayment']) {
        this.editView = true;
        this.title = 'Editar forma de pagamento';
        this.codPayment = params['codPayment'];
        this.descPayment = params['descPayment'];
      }
    });
  }

  ngOnInit() {
    this.breadcrumb = {
      items: [
        { label: 'Fretamento Urbano', link: '/' },
        {
          label: 'Cadastrar formas de pagamento',
          link: '/formas-de-pagamento',
        },
        {
          label: !this.editView
            ? 'Incluir forma de pagamento'
            : `${this.codPayment} - ${this.descPayment}`,
        },
      ],
    };
  }

  /*******************************************************************************
   * @name confirmCancel
   * @description Ação responsável por cancelar o processo atual quando perguntado
   * no modal e navega de volta para o browse
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  public confirmCancel: PoModalAction = {
    label: 'Sim',
    action: () => {
      this.modalCancel.close();
      this._router.navigate(['formas-de-pagamento']);
    },
  };

  /*******************************************************************************
   * @name exitCancel
   * @description Ação responsável por manter no processo atual quando perguntado
   * no modal e permanece na mesma tela
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  public exitCancel: PoModalAction = {
    label: 'Não',
    action: () => this.modalCancel.close(),
  };

  /*******************************************************************************
   * @name saveAction
   * @description Função responsável por salvar a nova forma de pagamentoou editar
   * uma forma de pagamento escolhida e navegar de volta pro browse
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  saveAction() {
    if (this.editView) {
      //nova forma de pagamento
      this.changeLoading();
      setTimeout(() => {
        console.log(this.codPayment);
        console.log(this.descPayment);
        this.codPayment = '';
        this.descPayment = '';
        this.modalCancel.close();
        this.changeLoading();
        this._router.navigate(['formas-de-pagamento']);
      }, 1000);
    } else {
      //editar forma de pagamento
      this.changeLoading();
      setTimeout(() => {
        console.log(this.codPayment);
        console.log(this.descPayment);
        this.codPayment = '';
        this.descPayment = '';
        this.modalCancel.close();
        this.changeLoading();
        this._router.navigate(['formas-de-pagamento']);
      }, 1000);
    }
  }

  /*******************************************************************************
   * @name saveActionAndContinue
   * @description Função responsável por salvar a nova forma de pagamento e recarregar
   * a página atual novamente
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  saveActionAndContinue() {
    this.changeLoading();
    setTimeout(() => {
      console.log(this.codPayment);
      console.log(this.descPayment);
      this.codPayment = '';
      this.descPayment = '';
      this.modalCancel.close();
      this.changeLoading();
    }, 1000);
  }

  /*******************************************************************************
   * @name changeLoading
   * @description Função responsável por trocar o valor da flag isShowLoading,
   * para mostrar ou esconder o loading na tela
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  changeLoading() {
    if (this.isShowLoading) {
      this.isShowLoading = false;
    } else {
      this.isShowLoading = true;
    }
  }
}
