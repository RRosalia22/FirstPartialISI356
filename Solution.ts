/*Solution

SOLID Principles:
!!Single Responsibility Principle: La clase LibraryManager se ocupa únicamente de la lógica de la biblioteca, 
!mientras que el servicio EmailService se ocupa del envío de correos electrónicos.
Open/Closed Principle: Las clases están abiertas para extensión (por ejemplo, añadiendo más tipos de notificaciones)
 pero cerradas para modificación.
Liskov Substitution Principle: User implementa la interfaz IObserver, lo que significa que se puede sustituir 
por cualquier otro objeto que también implemente la interfaz.
Dependency Inversion Principle: Se inyecta IEmailService en LibraryManager,
 lo que significa que LibraryManager no depende de una implementación concreta.

Inyección de Dependencias:
Inyectar IEmailService en LibraryManager.

! Lambda Expressions:
Usar expresiones lambda en funciones como find y forEach.

Singleton Pattern:
Garantizar que solo haya una instancia de LibraryManager con el método getInstance.

Observer Pattern:
Los usuarios (User) se registran como observadores y son notificados cuando se añade un nuevo libro.

Builder Pattern:
Se utiliza para construir instancias de Book de una manera más limpia y escalable.

Refactorización:
eliminar el uso de ANY mejorar el performance

Aspectos (Opcional)
Puedes anadir logs de info, warning y error en las llamadas, para un mejor control

Diseño por Contrato (Opcional):
Puedes anadir validaciones en precondiciones o postcondiciones como lo veas necesario */

// SOLUCION

class Book {
    constructor(public title: string, public author: string, public ISBN: string) {}
}

// Interfaz para el servicio de envío de correos electrónicos
interface IEmailService {
    sendEmail(userID: string, message: string): void;
}
// si es neceario agregar otro tipo de mensajes solo se deberia agregar interfaces nuevas 
// e implementarlas en Email Service
// 
class EmailService implements IEmailService {
    sendEmail(userID: string, message: string) {
        console.log(`Enviando email a ${userID}: ${message}`);
        // Implementación hipotetica del envío de correo
    }
}
//bulider para libros
class BookBuilder {
    private title: string = "";
    private author: string = "";
    private ISBN: string = "";

    withTitle(title: string) {
        this.title = title;
        return this;
    }

    withAuthor(author: string) {
        this.author = author;
        return this;
    }

    withISBN(ISBN: string) {
        this.ISBN = ISBN;
        return this;
    }

    build() {
        return new Book(this.title, this.author, this.ISBN);
    }
}

//observer
class User implements IObserver {
    update(message: string): void {
        throw new Error("Method not implemented.");
    }
    // Implementación de User
    // ...
}

// Interfaz Observer
interface IObserver {
    // Método para notificar a los observadores
    update(message: string): void;
}
// Ahora  LibraryManager se necarga 
class LibraryManager {
    private books: Book[] = [];
    private loans: any[] = [];
    private emailService: IEmailService;

    private static instance: LibraryManager; //se instacia una solo vez asi qeu cumple singleton

    private constructor(emailService: IEmailService) {
        this.emailService = emailService;
    }

    public static getInstance(emailService: IEmailService): LibraryManager {
        if (!this.instance) {
            this.instance = new LibraryManager(emailService);
        }
        return this.instance;
    }

    addBook(book: Book) {
        this.books.push(book);
    }

    removeBook(ISBN: string) {
        // usamos lamda
        this.books = this.books.filter(book => book.ISBN !== ISBN); 
    }

    listBooks(): Book[] {
        return this.books;
    }

    loanBook(ISBN: string, userID: string) {
        //uso de lamda
        const book = this.books.find(b => b.ISBN === ISBN);
        if (book) {
            // Lógica para gestionar el préstamo.
            this.sendEmail(userID, `Has solicitado el libro '${book.title}'.`);
        }
    }

    returnBook(ISBN: string, userID: string) {
        // Lógica para gestionar la devolución del libro.
        const book = this.books.find(b => b.ISBN === ISBN);
        if (book) {
            // Lógica para gestionar la devolución del libro.
            this.sendEmail(userID, `Has devuelto el libro '${book.title}'. ¡Gracias!`);
        }
    }

    private sendEmail(userID: string, message: string) {
        this.emailService.sendEmail(userID, message);
    }
}

// Crear una instancia del servicio de envío de correos electrónicos
const emailService = new EmailService();

// Crear una instancia de LibraryManager utilizando el patrón Singleton e aplicamos inyeccion de dependencias 
const libraryManager = LibraryManager.getInstance(emailService);

// U
const book1 = new Book("El Gran Gatsby", "F. Scott Fitzgerald", "123456789");
libraryManager.addBook(book1);
const book3 = new BookBuilder()
    .withAuthor("Gabriel Gari Marquez")
    .withTitle("Cien años de soledad")
    .build();



const book2 = new Book("1984", "George Orwell", "987654321");
libraryManager.addBook(book2);

// Realizar préstamo y devolución de libros
libraryManager.loanBook("123456789", "user01");
libraryManager.returnBook("123456789", "user01");

// Obtener la lista de libros
const books = libraryManager.listBooks();
console.log("Lista de libros en la biblioteca:");
console.log(books);

