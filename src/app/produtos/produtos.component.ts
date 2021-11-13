
import { AlertasService } from './../service/alertas.service';
import { AuthService } from './../service/auth.service';
import { User } from './../model/User';
import { Tema } from './../model/Tema';
import { TemaService } from './../service/tema.service';
import { ProdutoService } from '../service/produtos.service';
import { Produto } from '../model/Produto';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { CarrinhoService } from '../service/carrinho.service';
import { Carrinho } from '../model/Carrinho';
// import { Console } from 'console';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {
  
  

  postagem: Produto = new Produto()
  produtoSelecionado: Produto = new Produto()
  listaProdutos: Produto[]
  tituloPost: string

  tema: Tema = new Tema()
  listaTemas: Tema[]
  idTema: number
  idProduto: number
  nomeTema: string

  user: User = new User()
  idUser = environment.id

  key = 'data'
  reverse = true
  nome = environment.nome
  // modal:any;

  

  constructor(
    private router: Router,
    private produtoService: ProdutoService,
    private temaService: TemaService,
    public authService: AuthService,
    private alertas: AlertasService,
    private carrinhoService: CarrinhoService
  ) { }

  ngOnInit() {
    window.scroll(0,0)

    // if(environment.token == ''){
    //   this.router.navigate(['/entrar'])
    // }

    this.getAllTemas()
    this.getAllProdutos()

    
  }

  getAllTemas(){
    this.temaService.getAllTema().subscribe((resp: Tema[]) => {
      this.listaTemas = resp
    })
  }

  findByIdTema(){
    this.temaService.getByIdTema(this.idTema).subscribe((resp: Tema) =>{
      this.tema = resp
    })
  }

  findByIdProduto(){
    this.produtoService.getByIdProduto(this.idProduto).subscribe((resp: Produto) =>{
      this.postagem = resp
    })
  }

  getAllProdutos(){
    this.produtoService.getAllProdutos().subscribe((resp: Produto[]) => {
      this.listaProdutos = resp
    })
  }

  findByIdUser(){
    this.authService.getByIdUser(this.idUser).subscribe((resp: User) => {
      this.user = resp
    })
  }

  publicar(){
    this.tema.id = this.idTema
    this.postagem.tema = this.tema
    this.postagem.id = this.idProduto

    this.user.id = this.idUser
    this.postagem.usuario = this.user

    this.produtoService.postProduto(this.postagem).subscribe((resp: Produto) => {
      this.postagem = resp
      this.alertas.showAlertSuccess('Produto realizada com sucesso!')
      this.postagem = new Produto()
      this.getAllProdutos()
    })
  }

  findByTituloProduto(){
    if(this.tituloPost == ''){
      this.getAllProdutos()
    } else {
      this.produtoService.getByNomeProduto(this.tituloPost).subscribe((resp: Produto[]) => {
        this.listaProdutos = resp
      })
    }
  }

  findByNomeTema(){
    if(this.nomeTema == ''){
      this.getAllTemas()
    } else {
      this.temaService.getByNomeTema(this.nomeTema).subscribe((resp: Tema[]) => {
        this.listaTemas = resp
      })
    }
  }

  selecionarProduto(item:any){
    
    this.produtoSelecionado = item;
    
  }

  //Adicionar item no carrinho
  adicionarAoCarrinho(produto: Produto) {
    const carrinho = new Carrinho(produto)
    this.carrinhoService.adicionarItemCarrinho(carrinho)
    this.alertas.showAlertSuccess("Item adicionado ao carrinho")
  }
  

}