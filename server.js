import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';


const url = "https://wvkxbzncbsjhcuuetvpl.supabase.co";
const api = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2a3hiem5jYnNqaGN1dWV0dnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njk4MDg5MjEsImV4cCI6MTk4NTM4NDkyMX0.NBWxHR6-pV5ei56q9qh3cjNJODGYiIE16giZQVZ0S9U";

const supabase = createClient(url, api);



serve(async (req) => {
    const pathname = new URL(req.url).pathname;

    if (req.method === "GET" && pathname === "/get_title") {
        const obj = await supabase.from('mdsave').select('title, author');
        let titles = "";
        let authors = "";
        for (const i in obj.data) {
            titles += obj.data[i].title;
            authors += obj.data[i].author;
            if (i != obj.data.length - 1) {
                titles += "@&@";
                authors += "@&@";
            }
        }
        return new Response(titles + "@%@" + authors);
    }

    if (req.method === "POST" && pathname === "/get_text") {
        const requestJson = await req.json();
        const title = requestJson.title;
        const obj = await supabase.from('mdsave').select('text').eq("title", title);
        const text = obj.data[0].text;
        return new Response(text);
    }

    if (req.method === "POST" && pathname === "/post_text") {
        const requestJson = await req.json();
        const text = requestJson.text;
        const title = text.slice(0, text.indexOf('\n'));
        const author = requestJson.author;
        const obj = await supabase.from('mdsave').select('title');
        for (const i in obj.data) {
            if (title == obj.data[i].title) {
                return new Response("double");
            }
        }
        const res = await supabase.from('mdsave')
            .insert([{ 'text': text, 'title': title, 'author': author }]);
        return new Response(res.error);
    }


    if (req.method === "POST" && pathname === "/del_post") {
        const requestJson = await req.json();
        const title = requestJson.title;
        const res = await supabase.from('mdsave').delete().match({ 'title': title });
        return new Response(res.error);
    }

    return serveDir(req, {
        fsRoot: "public",
        urlRoot: "",
        showDirListing: true,
        enableCors: true,
    });
});
