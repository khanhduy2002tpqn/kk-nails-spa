async function main() {
  const { Resend } = await import("resend");
  const resend = new Resend("re_XBFdsgUs_2k5J1JASn4ZEMZXkBYo3k7S8");

  const result = await resend.emails.send({
    from: "noreply@kknailsandspa.us",
    to: "khanhduy2002tpqn@gmail.com",
    subject: "Test Resend",
    html: "<h1>Hello World</h1>",
  });

  console.log(result);
}

main();
