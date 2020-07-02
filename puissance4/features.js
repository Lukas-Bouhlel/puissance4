(function ($) {
    $("#mute").click(function () {
        if ($("audio").prop('muted')) {
            $("audio").prop('muted', false);
        } else {
            $("audio").prop('muted', true);
        }
    });

    $(".action").click(function () {
        $(".action").remove();
        $(".play").css('visibility', "visible");
        $.fn.P4 = function () {
            $("#start").click(function () {
                const Y = $("#lgn").val();
                const X = $("#col").val();
                const player1 = $("#name1").val();
                const player2 = $("#name2").val();
                $(".play").css('visibility', "hidden");
                $("#reload").css('visibility', "visible");
                $('#grid').ready(function () {
                    const p4 = new Puissance4('#grid', Y, X, player1, player2);
                    $('#restart').on('click', function () {
                        $('#grid').empty();
                        $(".content")[0].firstChild.data = "";
                        $('.win').css('visibility', 'hidden');
                        p4.drawGame();
                    });
                });
            });
            
            $("#reload").click(function () {
                location.reload(true);
            });

            $("body").css('background-image', 'url(assets/1505368532_blue_balcony_by_kirokaze-d9h03vb.gif)');
            $('.audio').attr('src', 'assets/gameMusic.mp3');

            class Puissance4 {
                constructor(selector, Y, X, player1, player2) {//L'affichage des grilles pour les colonnes et les lignes
                    this.Y = Y;
                    this.X = X;
                    this.selector = selector;
                    this.color = 'green';
                    this.player1 = player1;
                    this.player2 = player2;
                    this.drawGame();
                    this.ecoute();
                    this.checkwin();
                }

                //Afficher le jeu
                drawGame() {
                    const $jeu = $(this.selector);//Ici sera stocker le jeu qui sera egal à ce qu'on lui aura passer en paramètre lors de l'appel de la classe

                    for (let lgn = 0; lgn < this.Y; lgn++) {
                        const $lgn = $('<div>').addClass('lgn');//lgn pour nous c'est une div qui aura la class lgn
                        for (let col = 0; col < this.X; col++) {
                            const $col = $('<div>').addClass('col empty').attr("data-col", col).attr("data-lgn", lgn);//col pour nous c'est une div qui aura la class col empty et puis ont stocke ca col et ca lgn;
                            $lgn.append($col);//Afficher cet colonne dans la lgn 
                        }
                        $jeu.append($lgn);//Afficher la lgn dans le jeu
                    }
                }

                //On cherche la dernière case libre
                ecoute() {
                    const $jeu = $(this.selector);
                    const that = this;
                    function lastCase(col) {
                        const $cells = $(`.col[data-col='${col}']`);
                        for (let i = $cells.length - 1; i >= 0; i--) {
                            const $cell = $($cells[i]);
                            if ($cell.hasClass('empty')) {
                                return $cell;
                            }
                        }
                        return null;
                    }
                    $jeu.on('mouseenter', '.col.empty', function () {
                        const $col = $(this).data('col');
                        const $last = lastCase($col);
                        if ($last != null) {
                            $last.addClass(`p${that.color}`);
                        }
                    });

                    $jeu.on('mouseleave', '.col', function () {
                        $('.col').removeClass(`p${that.color}`);
                    });
                    $("#tour").css('visibility', "visible");
                    $("#bulleTour").text(`Au tour de la couleur ${that.color}`);
                    $jeu.on('click', '.col.empty', function () {
                        const col = $(this).data('col');
                        const $last = lastCase(col);
                        $last.addClass(`${that.color}`).removeClass(`empty p${that.color}`).data('color', `${that.color}`);
                        const winner = that.checkwin($last.data('lgn'), $last.data('col'));
                        that.color = (that.color === 'green') ? 'orange' : 'green';
                        $("#bulleTour").text(`Au tour de la couleur ${that.color}`);
                        if (winner) {
                            $(".win").css('visibility', "visible");
                            $(".content").prepend(`Les ${winner} ont gagné la partie`);
                        }
                        else if ($("#grid").children().children().not(".green").not(".orange").length == 0) {
                            $(".win").css('visibility', "visible");
                            $(".content").prepend(`Partie nulle plus de cases disponible`);
                        }
                    });
                }

                checkwin(lgn, col) {
                    const that = this;

                    function $getCell(y, x) {
                        return $(`.col[data-lgn='${y}'][data-col='${x}']`);
                    }

                    function checkDirection(direction) {
                        let total = 0;
                        let y = lgn + direction.y;
                        let x = col + direction.x;
                        let $next = $getCell(y, x);
                        while (y >= 0 && y < that.Y && x >= 0 && x < that.X && $next.data('color') === that.color) {
                            total++;
                            y += direction.y;
                            x += direction.x;
                            $next = $getCell(y, x);
                        }
                        return total;
                    }

                    function checkwin(directionY, directionX) {
                        const total = 1 + checkDirection(directionY) + checkDirection(directionX);
                        if (total >= 4) {
                            return that.color;
                        } else {
                            return null;
                        }
                    }

                    function checkHori() {
                        return checkwin({ y: 0, x: -1 }, { y: 0, x: 1 });
                    }

                    function checkVerti() {
                        return checkwin({ y: -1, x: 0 }, { y: 1, x: 0 });
                    }

                    function checkDiag1() {
                        return checkwin({ y: 1, x: 1 }, { y: -1, x: -1 });
                    }

                    function checkDiag2() {
                        return checkwin({ y: 1, x: -1 }, { y: -1, x: 1 });
                    }

                    return checkHori() || checkVerti() || checkDiag1() || checkDiag2();
                }
            }
        };
        $(".plugin").P4();
    });
}(jQuery));