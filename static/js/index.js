window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}

// Video Carousel functions
var currentCarouselIndex = 0;
const TOTAL_VIDEOS = 4;
const ITEM_WIDTH = 75;
const CENTER_OFFSET = 12.5;

function updateCarousel() {
  const track = document.getElementById('carouselTrack');
  const items = document.querySelectorAll('.carousel-item');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  // 轨道中有5个item：[V1][V2][V3][V4][V1克隆]
  // 直接计算偏移量
  const offset = -currentCarouselIndex * ITEM_WIDTH + CENTER_OFFSET;
  track.style.transform = `translateX(${offset}%)`;

  // 更新指示点
  indicators.forEach((dot, index) => {
    if (index === currentCarouselIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // 更新按钮禁用状态
  if (currentCarouselIndex === 0) {
    prevBtn.disabled = true;
    prevBtn.classList.add('hidden');
  } else {
    prevBtn.disabled = false;
    prevBtn.classList.remove('hidden');
  }

  if (currentCarouselIndex === TOTAL_VIDEOS - 1) {
    nextBtn.disabled = true;
    nextBtn.classList.add('hidden');
  } else {
    nextBtn.disabled = false;
    nextBtn.classList.remove('hidden');
  }

  // 所有视频始终播放
  items.forEach((item) => {
    const video = item.querySelector('.carousel-video');
    if (video) {
      video.play().catch(() => {});
    }
  });
}

function changeCarouselVideo(direction) {
  // 检查按钮是否被禁用
  if (direction < 0 && currentCarouselIndex === 0) return;
  if (direction > 0 && currentCarouselIndex === TOTAL_VIDEOS - 1) return;

  const track = document.getElementById('carouselTrack');

  // 有过渡效果地切换
  track.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';

  currentCarouselIndex += direction;

  updateCarousel();
}

function goToCarouselVideo(index) {
  const track = document.getElementById('carouselTrack');

  // 有过渡效果地跳转
  track.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';

  currentCarouselIndex = index;
  updateCarousel();
}

// 初始化轮播
document.addEventListener('DOMContentLoaded', function() {
  const track = document.getElementById('carouselTrack');
  if (track) {
    track.style.transition = 'none';
    updateCarousel();
  }
});



$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    // Scroll to Top Button functionality
    var scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
      } else {
        scrollToTopBtn.classList.remove('show');
      }
    });

    // Scroll to top on button click
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

})
