export default function Page2() {
  return (
    <>
      <section class="text-gray-700 body-font">
        <div class="container mx-auto mt-5">
          <div class="flex flex-wrap -m-4 text-center justify-center">
            <div class="p-4 md:w-1/4 sm:w-1/2 w-ful">
              <div class="border-2 border-gray-600 px-4 py-6 rounded-lg transform transition duration-500 hover:scale-11">
                <h2 class="title-font font-semibold text-2xl text-gray-900">
                  Tokens Left for Sale
                </h2>
                <p class="leading-relaxed">2.7k</p>
              </div>
            </div>
            <div class="p-4 md:w-1/4 sm:w-1/2 w-ful">
              <div class="border-2 border-gray-600 px-4 py-6 rounded-lg transform transition duration-500 hover:scale-110">
                <h2 class="title-font font-semibold text-2xl text-gray-900">
                  Tokens Sold
                </h2>
                <p class="leading-relaxed">1.3k</p>
              </div>
            </div>
            <div class="p-4 md:w-1/4 sm:w-1/2 w-ful">
              <div class="border-2 border-gray-600 px-4 py-6 rounded-lg transform transition duration-500 hover:scale-110">
                <h2 class="title-font font-semibold text-2xl text-gray-900">
                  Raised Amount
                </h2>
                <p class="leading-relaxed">75</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
